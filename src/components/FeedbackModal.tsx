"use client";

import React, { useState } from "react";
import { X, Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { submitFeedbackAction } from "@/lib/actions";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservaId: string;
  reservaTitle: string;
  onSuccess: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  reservaId,
  reservaTitle,
  onSuccess,
}) => {
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingEquipment, setRatingEquipment] = useState(5);
  const [ratingSupport, setRatingSupport] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await submitFeedbackAction(reservaId, {
        overall: ratingOverall,
        equipment: ratingEquipment,
        support: ratingSupport,
        comment,
      });
      onSuccess();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (value: number, setValue: (v: number) => void) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setValue(star)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`w-5 h-5 ${
              star <= value
                ? "text-amber-400 fill-amber-400"
                : "text-slate-600 hover:text-amber-400/50"
            }`}
          />
        </button>
      ))}
      <span className="text-xs text-amber-400 font-bold ml-2">{value} / 5</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Encuesta de Satisfacción Post-Evento
            </h2>
            <p className="text-xs text-slate-400 truncate max-w-sm">{reservaTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              1. Satisfacción General del Recinto e Instalaciones
            </label>
            {renderStars(ratingOverall, setRatingOverall)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              2. Rendimiento y Calidad del Equipamiento Audiovisual
            </label>
            {renderStars(ratingEquipment, setRatingEquipment)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              3. Rapidez y Trato del Personal de Soporte TI
            </label>
            {renderStars(ratingSupport, setRatingSupport)}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Comentarios u Observaciones Adicionales (Opcional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describa aspectos a destacar o sugerencias de mejora..."
              className="w-full bg-slate-800 text-xs text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Enviar Evaluación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
