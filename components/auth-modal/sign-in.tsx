import Image from "next/image";
import Link from "next/link";
import UserAuthForm from "./user-auth-form";

const SignIn = () => {
  return (
    <div className="container flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="relative size-12">
          <Image
            src="/eaut-logo.webp"
            alt="eaut-logo"
            fill
            className="size-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Chào mừng tới EAUT Community
        </h1>
        <p className="mx-auto max-w-xs text-sm">
          Để tiếp tục sử dụng dịch vụ, bạn có thể đăng nhập hoặc đăng ký
          bằng <b>tài khoản Google</b> của bạn.
        </p>

        {/* sign in form */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm" hidden>
          Lần đầu tới đây?
          <span className="text-sm underline underline-offset-4 ml-1">Đăng ký ngay</span>
        </p>
      </div>
      <span className="text-xs text-muted-foreground text-center">
        Bằng việc tiếp tục, có nghĩa là bạn đồng ý với điều khoản sử dụng của
        chúng tôi.
      </span>
    </div>
  );
};

export default SignIn;
