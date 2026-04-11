import { ensureUserDocument } from "../services/userService";
import { useState, useEffect } from "react";
import {auth} from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "../AuthContext";
import Container from "../components/Container";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {user, loading} = useAuth();

    useEffect(()=>{
        //Firebase가 "지금 로그인 상태인지" 확인이 끝났고(loading=false),
        //이미 로그잉ㄴ 된 user가 있으면 home으로 보내기
        if (!loading && user){
            navigate("/home");
        }
    },[user, loading, navigate]);

const getLoginErrorMessage = (error) =>{
                const code = error?.code;

                switch (code){
                    case "auth/invalid-email":
                        return "not correct email address.";
                    case "auth/user-not-found":
                        return "not registered email address."
                    case "auth/wrong-password":
                    case "auth/invalid-credential":
                        return "이메일 또는 비밀번호가 올바르지 않아요.";
                    case "auth/too-many-requests":
                        return "시도가 너무 많아요. 잠시 후 다시 시도해 주세요.";
                    case "auth/network-request-failed":
                        return "네트워크 오류가 발생했어요. 인터넷 연결을 확인해 주세요.";
                    default:
                        return error?.message || "로그인 중 오류가 발생했어요.";
                }
            };

    const handleLogin = async () => {
        if(!email || !password){
            alert("Enter your email and password.");
            return;
        }

        try{
            const userCredentail = await signInWithEmailAndPassword(auth, email, password);
            await ensureUserDocument(userCredentail.user);
            alert("Login Successful!");
            navigate("/home");
        } catch(error){
            /*console.error("ERROR:", error.message);
            alert(error.message);*/
            console.error("LOGIN ERROR: ", error);
            alert(getLoginErrorMessage(error));
        }
    };

    return (
        <Container>
           <div>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />

            <button onClick={handleLogin}>Login</button>

            <p>
                Don't you have an account yet? <Link to="/signup">Registration</Link>
            </p>
        </div> 
        </Container>
        
    );
}

export default Login;