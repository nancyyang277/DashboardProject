
import { StorageProvider } from "@/context/StorageProvider"
import { UserProvider } from "../context/UserProvider";
import UserSelector from "../components/userSelector";
import { AuthProvider } from "../context/AccountProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Avenir Next", sans-serif' }}>
      {/* <UserProvider> */}
            <AuthProvider><UserProvider><StorageProvider><UserSelector/>{children}</StorageProvider></UserProvider></AuthProvider>  
        {/* </UserProvider> */}
      </body>
    </html>
  );
}