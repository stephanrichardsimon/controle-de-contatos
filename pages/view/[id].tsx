import { useRouter } from "next/router";
import DefaultTemplate from "../../components/DefaultTemplate";
import RegisterComponent from "../../components/RegisterComponent";

export default function UpdatePg() {
  const router = useRouter();

  return (
    <DefaultTemplate>
      <RegisterComponent id={String(router.query.id)} readOnly={true} />
    </DefaultTemplate>
  );
}
