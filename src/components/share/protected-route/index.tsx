import { useAppSelector } from '@/redux/hooks'
import NotPermitted from './not-permitted';
import Loading from '../loading';
import { Navigate } from 'react-router-dom';

const RoleBaseRoute = (props: any) => {
    const user = useAppSelector(state => state.account.user);
    const userRole = user.role.name;

    if (userRole !== "NORMAL_USER") {
        return (<>{props.children}</>)
    } else {
        return (<NotPermitted />)
    }
}


const ProtectedRoute = (props: any) => {
    const isAuthticated = useAppSelector(state => state.account.isAuthenticated);
    const isLoading = useAppSelector(state => state.account.isLoading);


    return (
        <>
            {isLoading === true ?
                <Loading />
                :
                <>
                    {isAuthticated === true ?
                        <>
                            <RoleBaseRoute>
                                {props.children}
                            </RoleBaseRoute>
                        </>
                        :
                        <Navigate to={"/login"} replace />
                    }
                </>
            }
        </>
    )
}

export default ProtectedRoute
