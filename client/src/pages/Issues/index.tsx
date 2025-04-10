import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues } from "@/store/slices/issuesSlice";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const IssuesPage = () => {
    const { item } = useAppSelector((state) => state.issues)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchIssues())
        console.log(item)
    }, [dispatch])

    return (
        <div className="mx-4 min-h-full">
            <div>
                <input type="text" />
                <input type="text" />
            </div>
                    <ScrollArea className="max-h-3/4  overflow-y-hidden p-4 mb-4">
                {item.map((item) => {
                    return <p key={item.id} className="bg-gray-100 p-4 rounded-lg mb-2 font-medium">{item.title}</p>
                })}
                </ScrollArea>
                <div className="text-end p-8">
                    <Button className="p-4 hover:bg-red-300 items-center" >Создать задачу</Button>
                </div>
                
            
       
        </div>
        
    )
};