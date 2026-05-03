"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBars } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "@/store/authSlice";
import Link from "next/link";
import { RootState } from "@/store/store";
import { usePathname } from "next/navigation";
import axios from "axios";

type SearchResult = {
  id: number;
  title: string;
  thumbnail: string;
}


const Navbar = () => {
  const tabs = [{name: "Home", path: "/"},
    {name: "Movies", path: "/movies"},
    {name: "TV", path: "/tv"}
  ];
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const pathname = usePathname()
  const activeTab =
  tabs.find(tab =>
    tab.path === "/"
      ? pathname === "/"
      : pathname.startsWith(tab.path)
  )?.name;
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);


  // 🔥 underline animation
useLayoutEffect(() => {
  const updateUnderline = () => {
    if (!activeTab) return;

    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      const rect = currentTab.getBoundingClientRect();
      const containerRect =
        containerRef.current?.getBoundingClientRect() ?? { left: 0 };

      setUnderlineStyle({
        width: rect.width + "px",
        left: rect.left - containerRect.left + "px",
      });
    }
  };

  updateUnderline(); // run immediately

  window.addEventListener("resize", updateUnderline);
  return () => window.removeEventListener("resize", updateUnderline);
}, [activeTab]);

  // 🔥 click outside search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
  };

   useEffect(() => {
    if(query.length > 0){
       const getData = setTimeout(async() => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AP_URL}/videos/search?query=${query}`)
        if(response.status === 200){
          setSearchResults(response.data)
        }
      }, 2000)

      return () => clearTimeout(getData)
    }
     
   }, [query])

    function handleRouting(id: number){
      window.location.href = `/video/play/${id}`;
  }

  return (
    <div className="w-full">
      <div className="w-full h-24 border-b border-gray-800 flex items-center px-8 bg-black justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl sm:text-4xl text-white">
          VideoMotion
        </Link>

        {/* CENTER */}
        {showSearch ? (
          <div ref={searchRef} className="relative w-96">

            {/* Input */}
            <label className="flex items-center gap-2 bg-gray-800 rounded px-4 py-2">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="grow bg-transparent outline-none text-white"
                placeholder="Search"
                autoFocus
              />
            </label>

            {/* Dropdown */}
            {query && (
              <div className="absolute top-full left-0 w-full bg-black border border-gray-700 mt-2 rounded-md max-h-80 overflow-y-auto z-50">

                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-800 cursor-pointer border-b border-gray-800"
                    onClick={() => handleRouting(item.id)}
                  >
                    <img
                      src={item.thumbnail}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <p className="text-white text-sm">
                       {item.title}
                    </p>
                  </div>
                ))}
  
              </div>
            )}
          </div>
        ) : (
          <div ref={containerRef}  className="hidden sm:flex items-center gap-8 h-full relative">
            {tabs.map((tab) => (
              <Link href={tab.path} key={tab.name}>
                <div
              ref={(el) => {
  tabRefs.current[tab.name] = el;
}}
                className="cursor-pointer flex items-center h-full px-2"
              >
                <p
                className={`text-2xl ${
  activeTab === tab.name ? "text-white" : "text-gray-400"
}`}
                >
                  {tab.name}
                </p>
              </div>
              </Link>
              
            ))}

                            <span
    className="absolute bottom-0 h-[4px] bg-red-600 transition-all duration-300 ease-in-out"
    style={underlineStyle}
  />
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8">

          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="cursor-pointer text-white"
            onClick={handleSearchToggle}
          />

          {/* Profile Dropdown */}
          <details className="dropdown dropdown-end hidden sm:block">
            <summary className="cursor-pointer list-none">
              <img
                src={auth.user?.profile ?? '/default.jpg'}
                className="w-12 h-12 rounded-full object-cover"
              />
            </summary>

            <ul className="menu dropdown-content bg-black text-white rounded-box z-[50] w-40 p-2 shadow">

              {auth.token ? (
                <>
                  <li className="hover:bg-[#2e2e2d]">
                    <a href="/profile">Profile</a>
                  </li>

                        {auth.user?.type === "admin" && (
                    <li className="hover:bg-[#2e2e2d]">
                      <a href="/post">Upload</a>
                    </li>
                  )}


                  <li
                    className="hover:bg-[#2e2e2d]"
                    onClick={() => dispatch(clearAuth())}
                  >
                    <a>Logout</a>
                  </li>

            
                </>
              ) : (
                <li className="hover:bg-[#2e2e2d]">
                  <a href="/signup">Sign In</a>
                </li>
              )}
            </ul>
          </details>

          {/* Mobile Drawer */}
          <div className="drawer drawer-end sm:hidden">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
              <label htmlFor="my-drawer-4" className="cursor-pointer">
                <FontAwesomeIcon icon={faBars} className="text-white" />
              </label>
            </div>

            <div className="drawer-side">
              <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
              <div className="bg-black w-80 min-h-full p-4 flex flex-col">
                   <ul className="menu w-full text-white">

              {auth.token ? (
                <>
                  <li className="hover:bg-[#2e2e2d]">
                    <a href="/profile">Profile</a>
                  </li>

                  <li
                    className="hover:bg-[#2e2e2d]"
                    onClick={() => dispatch(clearAuth())}
                  >
                    <a>Logout</a>
                  </li>

                  {auth.user?.type === "admin" && (
                    <li className="hover:bg-[#2e2e2d]">
                      <a href="/post">Upload</a>
                    </li>
                  )}
                </>
              ) : (
                <li className="hover:bg-[#2e2e2d]">
                  <a href="/signup">Sign In</a>
                </li>
              )}
            </ul>



               <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"></div>
              <ul className="menu w-full text-white">
                {tabs.map((tab) => (
                    <li key={tab.name} className="hover:bg-[#2e2e2d]">
                    <a href={tab.path}>{tab.name}</a>
                  </li>
                ))}
              </ul>
              </div>
                
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Navbar;