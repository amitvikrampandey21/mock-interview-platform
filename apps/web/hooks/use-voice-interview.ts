"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function useVoiceInterview() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [supported, setSupported] = useState(false);
  const [listeningQuestionId, setListeningQuestionId] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("Voice mode is ready when your browser supports speech recognition.");

  useEffect(() => {
    const Recognition = getRecognitionConstructor();
    setSupported(Boolean(Recognition));

    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const readQuestion = useCallback((prompt: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceStatus("Text-to-speech is not available in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prompt);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    setVoiceStatus("Reading the question aloud.");
  }, []);

  const startListening = useCallback((
    questionId: string,
    initialAnswer: string,
    onTranscript: (value: string) => void
  ) => {
    const Recognition = getRecognitionConstructor();

    if (!Recognition) {
      setVoiceStatus("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    let stableTranscript = initialAnswer.trim();

    recognition.onresult = (event) => {
      let latestInterim = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript?.trim() ?? "";

        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          stableTranscript = [stableTranscript, transcript].filter(Boolean).join(" ").trim();
          onTranscript(stableTranscript);
          latestInterim = "";
        } else {
          latestInterim = transcript;
        }
      }

      setInterimTranscript(latestInterim);
    };

    recognition.onerror = (event) => {
      setVoiceStatus(`Voice capture error: ${event.error}`);
      setListeningQuestionId(null);
      setInterimTranscript("");
    };

    recognition.onend = () => {
      setListeningQuestionId((current) => (current === questionId ? null : current));
      setInterimTranscript("");
      setVoiceStatus("Voice capture stopped.");
    };

    recognitionRef.current = recognition;
    setListeningQuestionId(questionId);
    setInterimTranscript("");
    setVoiceStatus("Listening... speak your answer naturally.");
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListeningQuestionId(null);
    setInterimTranscript("");
    setVoiceStatus("Voice capture stopped.");
  }, []);

  return {
    supported,
    listeningQuestionId,
    interimTranscript,
    voiceStatus,
    readQuestion,
    startListening,
    stopListening
  };
}
