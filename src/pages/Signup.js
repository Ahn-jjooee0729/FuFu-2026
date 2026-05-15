import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Container from "../components/Container";
import logoFufu from "../assets/logofufu.svg";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!email || !password) {
        alert("Enter your email and password.");
        return;
        }

        try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            nickname: user.email.split("@")[0],
            following: [],
            followers: [],
            profileImageUrl: "",
            defaultProfileType: "basic_profile1",
            createdAt: new Date(),
        });

        navigate("/home");
        } catch (error) {
        console.error("ERROR:", error.message);
        alert(error.message);
        }
    };

    return (
        <Container>
        <div style={pageStyle}>
            <img src={logoFufu} alt="FUFU logo" style={logoStyle} />

            <div style={formAreaStyle}>
            <h1 style={titleStyle}>Create your Account</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
            />

            <button type="button" onClick={handleSignup} style={mainButtonStyle}>
                Sign up
            </button>
            </div>

            <div style={bottomTextStyle}>
            <span style={bottomGrayTextStyle}>Already have an account?</span>

            <Link to="/" style={bottomLinkStyle}>
                Login
            </Link>
            </div>
        </div>
        </Container>
    );
    }

export default Signup;

const pageStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    background: "#FFFFFF",
    overflow: "hidden",
    boxSizing: "border-box",
};

const logoStyle = {
    position: "absolute",
    top: 160,
    left: "50%",
    transform: "translateX(-50%)",
    width: 140,
    height: "auto",
    objectFit: "contain",
};

const formAreaStyle = {
    position: "absolute",
    top: 340,
    left: 0,
    right: 0,
    padding: "0 64px",
    boxSizing: "border-box",
};

const titleStyle = {
    margin: "0 0 24px",
    fontFamily: "AppleSDGothicNeoSB00, sans-serif",
    fontSize: 20,
    fontWeight: 600,
    color: "#000000",
    lineHeight: 1.2,
};

const inputStyle = {
    width: "100%",
    height: 50,
    borderRadius: 16,
    border: "1px solid #D6D6D6",
    background: "#FFFFFF",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    padding: "0 28px",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "AppleSDGothicNeoM00, sans-serif",
    fontSize: 16,
    color: "#111111",
    marginBottom: 14,
};

const mainButtonStyle = {
    width: "100%",
    height: 50,
    borderRadius: 999,
    border: "none",
    background: "#1A1A1A",
    color: "#FFFFFF",
    padding: "0 28px",
    boxSizing: "border-box",
    fontFamily: "Pacaembu, sans-serif",
    fontSize: 26,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
};

const bottomTextStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "AppleSDGothicNeoM00, sans-serif",
    fontSize: 16,
};

const bottomGrayTextStyle = {
    color: "#9B9B9C",
};

const bottomLinkStyle = {
    color: "#E9B6CC",
    textDecoration: "none",
    fontFamily: "AppleSDGothicNeoSB00, sans-serif",
    fontWeight: 600,
};