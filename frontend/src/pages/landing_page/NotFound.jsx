import { Link } from "react-router";
import Button from "../../components/ui/Button";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-10 text-center">
      <p className="text-sm font-semibold tracking-wide uppercase text-primary-600 mb-2">404</p>
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mb-3">
        This page doesn't exist
      </h1>
      <p className="text-stone-500 mb-6 max-w-md">
        The page you're looking for may have moved or was never here to begin with.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Home</Button>
      </Link>
    </main>
  );
};

export default NotFound;
