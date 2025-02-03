"use client";
import { ToastContainer } from "react-toastify";
import SignedInNavbar from "../../../components/Navbar";
import { rechargeAction, signupAction } from "../../../functions/serveractions";
import { triggerToast } from "../../../functions/toast";

export default function page() {
  //how i used server action
  //1. defined server action in the file and then
  //2. called the action from here
  const handleRecharge = async (formData: FormData) => {
    const balance = formData.get('balance')
    const response = await rechargeAction(formData);
    if (response.success) {
      triggerToast("balance added ", "success");
    } else {
      triggerToast("balance was not added, something went wrong", "error");
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center ">
      {/* action attribute is here to send form data when submitted */}
      <form action={handleRecharge} className=" w-sm">
        <div className="mb-5">
          <label
            htmlFor="enter amount"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Enter Amount
          </label>
          <input
            type="number"
            name="balance"
            id="balance"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="amount"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Proceed
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
