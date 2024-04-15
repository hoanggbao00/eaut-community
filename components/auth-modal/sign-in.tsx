import Image from "next/image";
import Link from "next/link";
import UserAuthForm from "./user-auth-form";

const SignIn = () => {
  return (
    <div className="container flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="relative h-8 w-8">
          <Image
            src="/eaut-logo.webp"
            alt="eaut-logo"
            fill
            className="h-8 w-8 object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Chao mung quay lai
        </h1>
        <p className="mx-auto max-w-xs text-sm">
          De tiep tuc, vui long dang nhap hoac dang ky tai khoan EAUT Comunity
          va dong y voi dieu khoan su dung cua chung toi.
        </p>

        {/* sign in form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm">
          Lan dau toi day?{" "}
          <Link
            href="/sign-up"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Dang ky ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
