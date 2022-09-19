import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket }) => {
    const [messagesReceived, setMessagesReceived] = useState([]);

    const messagesColumnRef = useRef(null);

    let obj;

    window.onload = function() {
        console.log('Complete');
        socket.on('last_100_messages', (last100Messages) => {
            var ob = localStorage.getItem('msgData');
            console.log('Last 100 Messages:', JSON.parse(last100Messages));
            last100Messages = JSON.parse(last100Messages);
            // Sort messages by _createdtime_
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        return () => socket.off('last_100_messages');
    }

    //Runs when socket event is received from server
    useEffect(() => {
        socket.on('receive_message', (data) => { //receives message data
            console.log('test',data);
            localStorage.setItem('msgData', JSON.stringify(data));
            setMessagesReceived((state) => [ //array of objects containing msg data
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    _createdtime_: data._createdtime_,
                },
            ]);
        });

        //Remove event listener on component unmount
        return () => socket.off('received_messsage')
    }, [socket]);

    useEffect(() => {
        //Last 100 messages sent in chat room (fetched from db)
        socket.on('last_100_messages', (last100Messages) => {
            var ob = localStorage.getItem('msgData');
            console.log('Last 100 Messages:', JSON.parse(last100Messages));
            last100Messages = JSON.parse(last100Messages);
            // Sort messages by _createdtime_
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        return () => socket.off('last_100_messages');
    }, [socket]);

    //Scroll to the most recent message
    useEffect(() => {
        messagesColumnRef.current.scrollTop =
            messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);

    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a._createdtime_) - parseInt(b._createdtime_)
        );
    }

    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesReceived.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                            {formatDateFromTimestamp(msg._createdtime_)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default Messages;