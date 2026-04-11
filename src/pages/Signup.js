import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {useNavigate, Link} from "react-router-dom";
import Container from "../components/Container";

function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = async () => {
        try{
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            //Firestore에 사용자 저장
            await setDoc(doc(db, "users", user.uid),{
                email: user.email,
                nickname: user.email.split("@")[0],
                following: [],
                followers: [],
                createdAt: new Date(),
            });

            alert("Registration Successful!");
            navigate("/home");

        } catch(error){
            console.error("ERROR:", error.message);
            alert(error.message);
        }
    };

    return(
        <Container>
          <div>
            <h2>Registration</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />

            <button onClick={handleSignup}>Registration</button>
            <br />
            
            Already have an account?<Link>Login</Link>

        </div>  
        </Container>
        
    );
}

export default Signup;