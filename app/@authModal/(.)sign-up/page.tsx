import CloseAuthModal from "@/components/auth-modal/close-auth-modal";
import SignUp from "@/components/auth-modal/sign-up";

const SignUpModal = () => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className='container flex items-center h-full max-w-lg mx-auto'>
        <div className="relative bg-background w-full py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseAuthModal />
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  )
}

export default SignUpModal;