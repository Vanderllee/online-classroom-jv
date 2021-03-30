import { NextPage } from 'next';
import useSWR from 'swr';
import { signIn, signOut, useSession } from 'next-auth/client';

import api from '../utils/api';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {

  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/user/${session ?.user.email}`, api);

  if(error) {console.log(error)};
  if(data) {console.log(data)};

  return (
    <div>

        <Nav />
        {!session && (
          <div className="text-3xl">
            Favor fazer login para acessar essa página <br />

            <button onClick={():Promise<void> => signIn('auth0')}>Sign in</button>
          </div>
        )}

        {session && data && (
           <>
              <h1>Bem vindo à página profile</h1>
              <div className="text-3xl">
                  Signed in as {session.user.email} <br />
                  <button onClick={():Promise<void> => signOut()}>Sign out</button>
              </div>

              <h1 className="text-3xl">{data.data.name}</h1>
              <h1 className="text-3xl">{data.data.coins}</h1>
           </>
        )}

        {error && (<h1> Usuário com email {session.user.email} não existe </h1>)}

        { loading && (
          <div>
            <h1 className="text-5xl">
              LOADING...
            </h1>
          </div>
        )}

    </div>
  );
};

export default ProfilePage;
