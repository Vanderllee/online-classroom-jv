import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

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
    
    if(req.method === 'GET') {

         const {email} = req.query; 

         if(!email) {
             res.status(400).json({error: 'Missing email on request body.'});
             return;
         } 

        const { db } = await connect();

        const response = await db.collection('users').findOne({email})

        if(!response) {
            res.status(400).json({error: 'Email not found.'});
            return;
        }

        res.status(200).json(response);


    } else {
        res.status(400).json({error: 'Wrong request method'});
    }
}

