import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface IAvailableHours {
    monday: number[];
    tuesday: number[];
    wednesday: number[];
    thursday: number[];
    friday: number[];
}

interface ErrorResponseType {
    error: string;
}

interface SuccessResponseType {
    _id: string,
  name: string,
  email: string,
  cellphone: string,
  teacher: true,
  coins: boolean,
  courses: string[],
  available_hours: IAvailableHours,
  available_locations: string[],
  reviews: Record<string, unknown>[],
  appointments: Record<string, unknown>[],
}

export default async (
    req: NextApiRequest, 
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
    
    if(req.method === 'POST') {
        
        const {
            name, 
            cellphone, 
            email, 
            teacher, 
            courses, 
            available_hours, 
            available_locations
        }: {
            name: string,
            email: string,
            cellphone: string,
            teacher: boolean,
            courses: string[],
            available_hours: IAvailableHours,
            available_locations: string[],

        } = req.body;

      
        let invalidHour = false;

        for(const weekdays in available_hours) {
            available_hours[weekdays].forEach((hour: number) => {
                if(hour < 7 || hour > 20) {
                    invalidHour = true;
                    return;
                }
            })
        }

        if(invalidHour) {
            res.status(400).json({error:'You cannot teach between 20:00 and 7:00'});
            return;
        }
        
        if(!teacher)  {

            if(!name || !email || !cellphone) {
                res.status(400).json({error:'Missing body parameter'});
                return;
            }

        } else if (teacher)  {

            if(
                !name || 
                !email || 
                !cellphone || 
                !courses ||  
                !available_hours || 
                !available_locations
            ) {
                res.status(400).json({error:'Missing body parameter'});

                return;
            }

        }

    
        const { db } = await connect();

        const lowerCaseEmail = email.toLowerCase();
        const emailAlreadyExists = await db.collection('users').findOne({email:lowerCaseEmail});

        if(emailAlreadyExists) {
            res.status(400).json({error:`Email ${lowerCaseEmail} already exists.`});
            return;
        }
        
        const response = await db.collection('users').insertOne({
           name,
           email,
           cellphone,
           teacher,
           coins:1,
           courses: courses || [],
           available_hours: available_hours || {},
           available_locations: available_locations || [],
           reviews: [],
           appointments:[],
        });

        res.status(200).json(response.ops[0]);

    } else {
        res.status(400).json({error: 'Wrong request method'});
    }

    
}

