import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="h-14 border-b flex items-center px-4 justify-between">
      <h1 className="font-bold">POS SYSTEM</h1>
      <Button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </Button>
    </div>
  );
}
