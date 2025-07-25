import Auth from "../../components/Auth";
import Quote from "../../components/Quote";

const Signin = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="flex justify-center items-center p-4">
        <Auth type={"signin"} />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signin;
