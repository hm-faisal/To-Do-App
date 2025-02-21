const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {" "}
      {/* Adjust padding as needed */}
      {/* Header Skeleton */}
      <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full"></div>
      {/* Card Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Repeat Card Skeleton for desired number of cards */}
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-md h-48 w-full"
          >
            {/* You can add inner elements for more detailed skeletons if needed */}
            {/* Example: */}
            {/* <div className="h-4 bg-gray-300 rounded-t-md w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded-md w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded-md w-full"></div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
