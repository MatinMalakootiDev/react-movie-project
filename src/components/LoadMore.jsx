// components/LoadMore.jsx
const LoadMore = ({ onClick, isLoading }) => {
  return (
    <div className="flex justify-center mt-10 mb-10">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="bg-indigo-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            در حال بارگذاری...
          </>
        ) : (
          'مشاهده فیلم‌های بیشتر'
        )}
      </button>
    </div>
  );
};

export default LoadMore;
