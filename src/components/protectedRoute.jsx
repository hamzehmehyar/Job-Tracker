import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user , children , userData , requiredRole , loading }){

    if(loading) return <p>loading...</p>

    if(!user){

        return <Navigate to="/" replace/>

    }

    if(requiredRole && userData?.role !== requiredRole){

        return <Navigate to= "/dashboard" replace/>

    }

    return children;

}