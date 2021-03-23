import {Db, MongoClient} from 'mongodb';

interface ConnectType {
    db:Db,
    client:MongoClient
}

const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const connect = async():Promise<ConnectType> => {
    if(!client.isConnected()) await client.connect();

    const db = client.db('teach-other');

    return {db, client};
}

export default connect;

    
