import { NextApiRequest, NextApiResponse } from 'next';
import  { ObjectID } from 'mongodb';
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
  coins: 1,
  courses: string[],
  available_hours: object,
  available_locations: string[],
  reviews: object[],
  appointments: object[],
}

export default async (
    req: NextApiRequest, 
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
)
: Promise<void> => {
    
     if(req.method === 'GET') {

         const  id  = req.query.id as string;

         if(!id) {
             res.status(400).json({error: 'Missing teacher ID on request body.'});
             return;
         }

         let _id: ObjectID;

         try { 
             _id = new ObjectID(id);
         } catch {
             res.status(400).json({error: 'Wrong objectID'});
             return;
         }

        const { db } = await connect();

        const response = await db.collection('users').findOne({ _id:new ObjectID(id) });

        if(!response) {
            res.status(400).json({error: `Teacher with ID ${_id} not found.`});
            return;
        }

        res.status(200).json(response);


    } else {
        res.status(400).json({error: 'Wrong request method'});
    }
}

