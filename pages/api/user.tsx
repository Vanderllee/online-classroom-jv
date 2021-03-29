import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

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
  available_hours: Record<string, unknown>[],
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
            teacher: true,
            coins: boolean,
            courses: string[],
            available_hours: Record<string, unknown>[],
            available_locations: string[],

        } = req.body;
        
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

