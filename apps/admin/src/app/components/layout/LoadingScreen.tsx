export const LoadingScreen = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#F36A4F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[16px] text-[#6E6E6E]">{message}</p>
      </div>
    </div>
  );
};
