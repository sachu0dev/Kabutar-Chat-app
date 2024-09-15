import { useEffect, useState, useMemo, useRef } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);    
    const toastId = toast.loading(toastMessage || "Updating data...");
    try {
      const res = await mutate(...args);
      if (res.data) {
        toast.success(res.data.message || "Data updated successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const currentHandlers = handlersRef.current;

    Object.entries(currentHandlers).forEach(([event, handler]) => {
      socket.on(event, (...args) => {
        handlersRef.current[event](...args);
      });
    });

    return () => {
      Object.entries(currentHandlers).forEach(([event]) => {
        socket.off(event);
      });
    };
  }, [socket]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
