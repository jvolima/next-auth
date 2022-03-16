import { GetServerSideProps } from "next";
import { useContext, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
 
  useEffect(() => {
    api.get("me").then(response => console.log(response))
    .catch(error => console.error(error))
  }, [])

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);

  const response = await apiClient.get("/me");

  return {
    props: {}
  }
})