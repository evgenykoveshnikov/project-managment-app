import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const NavBar = () => {
    return (
        <div className="flex justify-between items-center  mb-4 shadow-2xs p-6">
            <nav>
            <Link to='/issues' className="mr-4 text-2xl font-semibold hover:text-red-400">Все задачи</Link>
            <Link to='/boards' className="text-2xl font-semibold hover:text-red-400">Проекты</Link>
            </nav>
            <Button className="hover:bg-red-300" variant={"default"} size={"lg"}>Создать задачу</Button>
        </div>
    )
}