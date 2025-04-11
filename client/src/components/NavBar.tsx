import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";

export const NavBar = () => {
    return (
        <div className="flex justify-between items-center  mb-4 shadow-2xs p-6">
            <nav>
            <NavLink to='/issues' className={({ isActive }) => 
      `mr-4 text-2xl font-semibold ${isActive ? 'text-red-400' : 'text-black'} hover:text-red-400`
    }>Все задачи</NavLink>
            <NavLink to='/boards' className={({ isActive }) => 
      `text-2xl font-semibold ${isActive ? 'text-red-400' : 'text-black'} hover:text-red-400`
    }>Проекты</NavLink>
            </nav>
            <Button className="hover:bg-red-300" variant={"default"} size={"lg"}>Создать задачу</Button>
        </div>
    )
}