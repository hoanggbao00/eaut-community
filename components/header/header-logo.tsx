"use client";

import Image from "next/image";

const HeaderLogo = () => {
  return (
    <a href="/" className="ml-2 flex items-center gap-2 xl:m-0">
      <div className="relative h-8 w-8">
        <Image
          src="/eaut-logo.webp"
          alt="eaut-logo"
          fill
          className="h-8 w-8 object-cover sm:h-6 sm:w-6"
        />
      </div>
      <p className="hidden text-sm font-medium text-foreground md:block">
        EAUT
        <br />
        Community
      </p>
    </a>
  );
};

export default HeaderLogo;
