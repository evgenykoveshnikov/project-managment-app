import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchIssues } from "@/store/slices/issuesSlice";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const IssuesPage = () => {
    const { item } = useAppSelector((state) => state.issues)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchIssues())
        console.log(item)
    }, [dispatch])

    return (
       <div className="h-full flex flex-col px-4 py-2 gap-4">
            <div className="flex gap-2">
                <Input placeholder="поиск по названию"></Input>
                <Input placeholder="фильтры"></Input>
            </div>
            <div className="flex-1 overflow-auto mb-2">
                <div className="flex flex-col gap-3">
                {item.map((task) => (
                    <Card>
                        <CardContent>
                            <p key={task.id}>{task.title}</p>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            
            <div className="flex justify-end mb-2">
                <Button size={"lg"} variant={'default'} className="hover:bg-red-300">
                    Создать задачу
                </Button>
            </div>
       </div>
    )
};