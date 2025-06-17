import React, { useState } from "react";
import { Manager } from "@twilio/flex-ui";
import { Button } from "@twilio-paste/core/button";
import { Form, FormControl } from "@twilio-paste/core/form";
import { Input } from "@twilio-paste/core/input";
import { Heading } from "@twilio-paste/core/heading";
import { Label } from "@twilio-paste/core/label";
import { Table, THead, Tr, Th, TBody, Td } from "@twilio-paste/core/table";
import { Text } from "@twilio-paste/core/text";
import Notification from "../Notification/Notification";
import "./styles.css";

const TaskBySid = () => {
    const [task, setTask] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const [id, setId] = useState("");

    const handleChange = (e) => {
        setId(e.target.value);
    };
    
    const handleClick = async (e, sid) => {
        e.preventDefault();
        
        if (!sid || !id) {
            setTask(null);
            return;
        }

        let query = "";

        if (sid.startsWith("CH")) {
            query = `data.attributes.conversationSid == "${sid}"`;
        } else if (sid.startsWith("CA")) {
            query = `data.attributes.call_sid == "${sid}"`
        } else {
            //Using sids that don't start with CH or CA, we keep the task null
            setIsOpen(true);
            setText(`Unsupported SID prefix: ${sid}`);
            setTask(null);
            return;
        }

        try {
            const taskFound = await Manager.getInstance().insightsClient.liveQuery("tr-task", query);
            const taskProp = taskFound.getItems();

            //Channel or Call sids that are not found
            if (Object.keys(taskProp).length === 0) {
                setIsOpen(true);
                setText(`Task not found with this sid: ${sid}`);
                setTask(null);
                return;
            }

            if (Object.keys(taskProp)[0].length > 0) {
                setTask(taskProp);
            }
        }
        catch (err) {
            console.log("An error occurred when searching for the task: ", err);
        }
    };

    return (
        <div className="main__container">
            <div className="notification__container">
                {isOpen && 
                    <Notification
                        text={text}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                }
            </div>
            <div className="search__container">
                <Form onSubmit={(e) => handleClick(e, id)}>
                    <Heading
                        as="h3"
                        variant="heading30"
                        marginBottom="space0"
                    >
                        Find assigned task by Conversation or Call Sid
                    </Heading>
                    <FormControl>
                        <Label>Conversation or Call Sid</Label>
                        <Input
                            type="text"
                            name="input"
                            value={id}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <Button type="submit" variant="primary">Search</Button>
                </Form>
                <Table>
                    <THead>
                    <Tr>
                        <Th>Worker</Th>
                        <Th>Task Sid</Th>
                        <Th>Worker Sid</Th>
                    </Tr>
                    </THead>
                    <TBody>
                        <Tr>
                            <Td>
                                <Text as="p" fontFamily="fontFamilyCode">
                                    {task !== null ? Object.values(task)[0].worker_name: ""}
                                </Text>
                            </Td>
                            <Td>
                                <Text as="p" fontFamily="fontFamilyCode">
                                    {task !== null ? Object.keys(task)[0] : ""}
                                </Text>
                            </Td>
                            <Td>
                                <Text as="p" fontFamily="fontFamilyCode">
                                    {task !== null ? Object.values(task)[0].worker_sid : ""}
                                </Text>
                            </Td>
                        </Tr>
                    </TBody>
                </Table>
            </div>
        </div>
    )
};

export default TaskBySid;