import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';

const Chat = ({ username, room, socket }) => {
    console.log('room', room);

    localStorage.setItem('user', username);
    localStorage.setItem('room', room);
    localStorage.setItem('socket', socket);

    var rm = localStorage.getItem('user');
    //console.log('rm', rm);

    
    window.onload = function (){
        console.log('rm', rm)
    }

    function reloadData(){}
    return (
        <div className={styles.chatContainer}>

            <RoomAndUsersColumn socket={socket} username={username} room={room} />

            <div>
                <MessagesReceived socket={socket} />
                <SendMessage socket={socket} username={username} room={room} />
            </div>
        </div>
    );
};

export default Chat;