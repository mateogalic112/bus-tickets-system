const Navigation = () => {
  return (
    <nav className="flex items-center gap-8  py-3 px-8 w-full">
      <h1 className="text-2xl grow font-bold leading-none tracking-tight text-gray-900  dark:text-white">
        Bus ticket system
      </h1>
      <div className="flex items-center grow">
        <div className="flex text-sm">
          <a
            href="#responsive-header"
            className="block lg:inline-block lg:mt-0  text-white mr-4"
          >
            Docs
          </a>
          <a
            href="#responsive-header"
            className="block lg:inline-block lg:mt-0  text-white mr-4"
          >
            Examples
          </a>
          <a
            href="#responsive-header"
            className="block lg:inline-block lg:mt-0  text-white"
          >
            Blog
          </a>
        </div>
        <div className="ml-auto">
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white  lg:mt-0"
          >
            Download
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
