import { ensureUserDocument } from "../services/userService";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Container from "../components/Container";
import logoFufu from "../assets/logofufu.svg";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
        navigate("/home");
        }
    }, [user, loading, navigate]);

    const getLoginErrorMessage = (error) => {
        const code = error?.code;

        switch (code) {
        case "auth/invalid-email":
            return "not correct email address.";
        case "auth/user-not-found":
            return "not registered email address.";
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
        if (!email || !password) {
        alert("Enter your email and password.");
        return;
        }

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        await ensureUserDocument(userCredential.user);
        navigate("/home");
        } catch (error) {
        console.error("LOGIN ERROR: ", error);
        alert(getLoginErrorMessage(error));
        }
    };

    return (
        <Container>
        <div style={pageStyle}>
            <img src={logoFufu} alt="FUFU logo" style={logoStyle} />

            <div style={formAreaStyle}>
            <h1 style={titleStyle}>Login to your Account</h1>

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

            <button type="button" onClick={handleLogin} style={mainButtonStyle}>
                Login
            </button>
            </div>

            <div style={bottomTextStyle}>
            <span style={bottomGrayTextStyle}>Haven&apos;t any account?</span>

            <Link to="/signup" style={bottomLinkStyle}>
                Sign up
            </Link>
            </div>
        </div>
        </Container>
    );
    }

export default Login;

const pageStyle = {
    width: "100%",
    minHeight: "100%",
    height: "100%",
    position: "relative",
    background: "#FFFFFF",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    boxSizing: "border-box",
    padding: "clamp(72px, 16dvh, 150px) clamp(28px, 8vw, 64px) calc(40px + env(safe-area-inset-bottom))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const logoStyle = {
    width: "clamp(110px, 34vw, 140px)",
    height: "auto",
    objectFit: "contain",
    marginBottom: "clamp(70px, 14dvh, 130px)",
};

const formAreaStyle = {
    width: "100%",
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
    marginTop: "auto",
    paddingTop: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "AppleSDGothicNeoM00, sans-serif",
    fontSize: "clamp(13px, 3.8vw, 16px)",
    flexWrap: "wrap",
    textAlign: "center",
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