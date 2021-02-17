import React, { useState, useEffect } from 'react';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import 'firebase/storage'
import "firebase/database";


function Chatroom() {
    const [text, setText] = useState("")
    const [userId, setUserId] = useState("")
    const [localMessages, setLocalMessages] = useState([])
    const [localImage, setLocalImage] = useState(null)
    const adminList = ["aL4VBW0h5fOhiCqyFdKTecVE3tE2"]

    const firestore = firebase.firestore()
    const storage = firebase.storage()
    useEffect(async () => {
        setUserId(firebase.auth()?.currentUser?.uid)
        var query = firestore.collection('Chats').orderBy("timestamp", "asc");
        query.onSnapshot({
            next: (querySnapshot) => {
                let messages = []
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    messages.push({ mid: doc.id, ...doc.data() })
                });    
                setLocalMessages(messages)
            },
        });

        if (firebase.auth().currentUser?.uid) {
            const users = firebase.database().ref("users");
            users.once('value')
                .then(async (snapshot) => {
                const usersData = snapshot.val();
                const usersIds = usersData ? Object.keys(usersData) : [];
                if (!usersIds.includes(firebase.auth().currentUser?.uid)) {
                    await firebase.database().ref("users/" + firebase.auth().currentUser?.uid).set({
                        online: true
                    });
                } else {
                    await firebase.database().ref(`users/${firebase.auth().currentUser.uid}/online`).set(true);
                }
            })

            // This turns off the online status
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/online`).onDisconnect().set(false);
        }
    }, []);
 
    return (
      <div>
        <div style={{ display: 'flex', flex: 1, height: '100vh', flexDirection: 'column' }}> 
            <div style={{ flex: 1, marginLeft: 24, marginRight: 24, overflow: 'auto', marginBottom: 24 }}>
                {localMessages.map((localMessage) => (
                    <div style={{ display: 'flex', flex: 1, justifyContent: userId === localMessage.uid ? 'flex-end' : 'flex-start'}}>
                        <div style={{ 
                            minHeight: 52, 
                            width: 600, 
                            backgroundColor: userId === localMessage.uid ? 'blue' : (localMessage.like === true ? 'yellow' : 'red'), 
                            marginTop: 24, 
                            paddingLeft: 24, 
                            paddingRight: 24, 
                            borderRadius: 12 }}>
                                <p>{localMessage.content}</p>
                                {localMessage?.image && localMessage.image.length > 0 && 
                                    <img style={{ width: '100%', height: 'auto', marginBottom: 24 }} src={localMessage.image} />}
                                {(userId !== localMessage.uid) && (adminList.includes(userId)) && (localMessage.like === false) &&
                                <button style={{ 
                                    backgroundColor: 'white', 
                                    color: 'black', 
                                    fontSize: 22, 
                                    marginBottom: 24, 
                                    borderWidth: 0, 
                                    fontWeight: 'bold', 
                                    borderRadius: 8, 
                                    paddingTop: 4, 
                                    paddingBottom: 4, 
                                    paddingLeft: 8, 
                                    paddingRight: 8 
                                }} onClick={async () => {
                                    // need the doc uid
                                    await firestore.collection("Chats").doc(localMessage.mid).update({
                                        like: true
                                    })
                                }}>Like</button>}
                        </div>
                    </div>)
                )}
            </div>
            <button style={{ 
                backgroundColor: 'black', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: 18, 
                borderWidth: 0 
            }} onClick={async () => {
                await firebase.database().ref(`users/${firebase.auth().currentUser.uid}/online`).set(false);
                firebase.auth().signOut()
            }}>Sign out</button>
            <div style={{ display: 'flex', flexDirection: 'row', margintTop: 24 }}>
                <form style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flex: 1, }} 
                    onSubmit={async (e) => {
                        e.preventDefault()
                        const timestamp = Date.now();
                        let image = ''
                        const content = text;
                        const uid = userId;
                        const like = false
                        if (localImage) {
                            const uniqueLocalImage = `${localImage.name}_${Math.random().toString(36)}`
                            const uploadTask = storage.ref(`/images/${uniqueLocalImage}`).put(localImage)
                            uploadTask.on('state_changed', 
                            () => {},
                            () => {},
                            async () => {
                                const fireBaseUrl = await storage.ref('images').child(uniqueLocalImage).getDownloadURL()
                                const message = { content, timestamp, uid, image: fireBaseUrl, like }
                                const docRef = await firestore.collection("Chats").add(message)
                            })
                        } else {
                            const message = { content, timestamp, uid, image, like }
                            const docRef = await firestore.collection("Chats").add(message)
                        }
                        
                        setText("")
                        setLocalImage(null)
                    }}>
                    <input style={{ 
                        flex: 11, 
                        height: 32, 
                        fontSize: 28 
                        }} type="text" value={text} onChange={(value) => {
                            setText(value.target.value)
                        }} />
                    <input 
                        key={Date.now()}
                        style={{ flex: 1 }}
                        type="file"
                        onChange={(e) => {
                            const image = e.target.files[0]
                            console.log(image)
                            setLocalImage(image)
                        }}
                        />
                    <button type='submit' style={{ 
                        flex: 1, 
                        backgroundColor: 'blue', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: 18, 
                        borderWidth: 0 
                        }} >Send</button>
                </form>
            </div>
        </div>
      </div>
    );
  }
  
  export default Chatroom;