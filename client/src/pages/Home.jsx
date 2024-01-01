// ** React Imports
import React, { useContext, useState } from 'react'

// ** Component Imports
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// ** lucide Icons
import { Plus } from 'lucide-react'

// ** Context
import { UserContext } from '@/context/UserContext'

// ** React Beautiful DND
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Home = () => {

    // ** Hooks
    const { createList, lists, listLoading, createTask, tasks, markTaskAsCompleted, setTasks, updateTaskListId } = useContext(UserContext);
    const { toast } = useToast()

    // ** State
    const [listName, setlistName] = useState('');
    const [taskName, setTaskName] = useState('');

    // Function to handle creating a new list
    const handleCreateList = async () => {
        if (listName.trim() === '') {
            toast({
                variant: "destructive",
                description: 'Please enter a list name'
            })
            return;
        }

        const { success, message } = await createList(listName);
        if (success) {
            toast({
                description: message,
            })
            setlistName('');
        } else {
            toast({
                variant: "destructive",
                description: message,
            })
        }
    }

    // Function to handle creating a new task
    const handleCreateTask = async (listId) => {
        if (taskName.trim() === '') {
            toast({
                variant: "destructive",
                description: 'Please enter a list name'
            })
            return;
        }

        const { success, message } = await createTask({ listId, taskName });
        if (success) {
            toast({
                description: message,
            })
            setTaskName('');
        } else {
            toast({
                variant: "destructive",
                description: message,
            })
        }
    }

    // Function to handle marking a task as completed
    const handleMarkAsCompleted = async (taskId) => {
        const result = await markTaskAsCompleted(taskId);
        const { success, message } = result;
        if (success) {
            toast({
                description: message,
            })
        } else {
            toast({
                variant: "destructive",
                description: message,
            })
        }
    }

    // Function to handle task reordering and database updates
    const onDragEnd = async (result) => {
        console.log("result: ", result);

        const { source, destination } = result;

        if (!destination) return; // Dropped outside of a droppable area
        if (destination.droppableId === source.droppableId && destination.index === source.index) return; // Dropped in the same place

        const sourceListId = Number(source.droppableId);
        const destinationListId = Number(destination.droppableId);
        const taskId = Number(result.draggableId);
        let updatedTask = tasks.find(task => task.id === taskId);
        updatedTask.listId = destinationListId;
        setTasks(prevState => prevState.map(task => task.id === taskId ? updatedTask : task));

        const { success, message } = await updateTaskListId(taskId, destinationListId);
        if (success) {
            toast({
                description: message,
            })
            setTaskName('');
        } else {
            toast({
                variant: "destructive",
                description: message,
            })
        }
    };

    // Loading skeleton while fetching data
    if (listLoading) {
        return (
            <section className="flex flex-col items-center pt-2" style={{ height: "calc(100vh - 66px)" }}>
                <div className="bg-white w-full max-w-[1440px] gap-3 md:mx-auto h-screen px-1 md:px-2 flex items-center justify-center">
                    <div className='min-w-[350px] w-1/4 h-full'>
                        <Skeleton className="h-full w-[350px]" />
                    </div>
                    <div className='min-w-[350px] w-1/4 h-full '>
                        <Skeleton className="h-full w-[350px]" />
                    </div>
                </div>
            </section>
        )
    }


    return (

        <DragDropContext onDragEnd={onDragEnd}>
            <section className="flex flex-col items-center pt-2" style={{ height: "calc(100vh - 66px)" }}>
                <div className="bg-white w-full max-w-[1440px] md:mx-auto h-screen px-1 md:px-2 flex items-center justify-center">
                    <div className="w-full h-full flex items-start justify-start space-x-2 overflow-x-auto listbox">
                        {
                            !listLoading && lists.map((list, idx) => (
                                <div key={list.id} className='min-w-[250px] w-1/4 h-full border'>
                                    <div className='w-full h-10 border-b flex items-center justify-center'>
                                        <p className='text-base font-bold text-gray-700'>{list.name}</p>
                                    </div>
                                    <Droppable droppableId={String(list.id)}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className='w-full h-full flex flex-col items-start justify-start py-2 px-1'>
                                                {
                                                    tasks.filter(task => task.listId === list.id).map((task, index) => (
                                                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                    draggable={true}
                                                                    className={`w-full h-10 space-x-2 flex items-center justify-start rounded-sm hover:bg-gray-100 px-2
                                                                    ${snapshot.isDragging ? 'bg-gray-300 shadow' : ''}
                                                                    `}>
                                                                    <Checkbox
                                                                        id={task.id}
                                                                        onClick={() => handleMarkAsCompleted(task.id)}
                                                                        checked={task.isComplete}
                                                                    />
                                                                    <Label htmlFor={task.id} className="text-sm font-medium">{task.name}</Label>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                }
                                                {provided.placeholder}
                                                <div className='w-full h-10 space-x-2 flex items-center justify-start rounded-sm'>
                                                    <Dialog>
                                                        <DialogTrigger className='w-full'>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-sm font-medium leading-none w-full"
                                                            >
                                                                <Plus size="16px" className='mr-1' />
                                                                Add Task
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Create New Task</DialogTitle>
                                                                <DialogDescription>
                                                                    Enter the name of the task you want to create.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid grid-cols-4 items-center gap-4">
                                                                    <Label htmlFor="name" className="text-right">
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id="name"
                                                                        placeholder="Buying Milk"
                                                                        className="col-span-3"
                                                                        value={taskName}
                                                                        onChange={(e) => setTaskName(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    type="submit"
                                                                    size="sm"
                                                                    onClick={() => handleCreateTask(list.id)}
                                                                >
                                                                    Create Task
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))
                        }

                        <div className='min-w-[250px] w-1/4 h-fit border'>
                            <div className='w-full h-10 border-b flex items-center justify-center'>
                                <p className='text-base font-bold text-gray-700'>Create New List</p>
                            </div>
                            <div className='w-full h-10 space-x-2 flex items-center justify-start rounded-sm p-1'>
                                <Dialog>
                                    <DialogTrigger className='w-full'>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-sm font-medium w-full"
                                        >
                                            <Plus size="16px" className='mr-1' />
                                            Add New List
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Create List</DialogTitle>
                                            <DialogDescription>
                                                Enter the name of the list you want to create.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    placeholder="Grocery List"
                                                    className="col-span-3"
                                                    value={listName}
                                                    onChange={(e) => setlistName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                onClick={handleCreateList}
                                            >
                                                Create
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DragDropContext>
    )
}

export default Home