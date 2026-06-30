import { create } from "zustand";
import {
  pacientes as seedPacientes,
  profesionales as seedProfesionales,
  especialidades as seedEspecialidades,
  citas as seedCitas,
  tratamientos as seedTratamientos,
  materiales as seedMateriales,
  gastos as seedGastos,
  pacienteActualId,
  profesionalActualId,
  type Paciente,
  type Profesional,
  type Especialidad,
  type Cita,
  type Tratamiento,
  type Material,
  type Gasto,
} from "@/data/mock";

const uid = () => Math.random().toString(36).slice(2, 9);

interface ClinicState {
  pacientes: Paciente[];
  profesionales: Profesional[];
  especialidades: Especialidad[];
  citas: Cita[];
  tratamientos: Tratamiento[];
  materiales: Material[];
  gastos: Gasto[];
  pacienteActualId: string;
  profesionalActualId: string;

  // CRUD pacientes
  addPaciente: (p: Omit<Paciente, "id">) => void;
  updatePaciente: (id: string, p: Partial<Paciente>) => void;
  deletePaciente: (id: string) => void;
  // CRUD profesionales
  addProfesional: (p: Omit<Profesional, "id">) => void;
  updateProfesional: (id: string, p: Partial<Profesional>) => void;
  deleteProfesional: (id: string) => void;
  // CRUD especialidades
  addEspecialidad: (e: Omit<Especialidad, "id">) => void;
  updateEspecialidad: (id: string, e: Partial<Especialidad>) => void;
  deleteEspecialidad: (id: string) => void;
  // Citas
  addCita: (c: Omit<Cita, "id">) => void;
  updateCita: (id: string, c: Partial<Cita>) => void;
  deleteCita: (id: string) => void;
  // Materiales
  addMaterial: (m: Omit<Material, "id">) => void;
  updateMaterial: (id: string, m: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  // Gastos
  addGasto: (g: Omit<Gasto, "id">) => void;
  updateGasto: (id: string, g: Partial<Gasto>) => void;
  deleteGasto: (id: string) => void;
  // Cuotas
  marcarCuotaPagada: (tratamientoId: string, numero: number) => void;
}

export const useClinic = create<ClinicState>((set) => ({
  pacientes: seedPacientes,
  profesionales: seedProfesionales,
  especialidades: seedEspecialidades,
  citas: seedCitas,
  tratamientos: seedTratamientos,
  materiales: seedMateriales,
  gastos: seedGastos,
  pacienteActualId,
  profesionalActualId,

  addPaciente: (p) => set((s) => ({ pacientes: [...s.pacientes, { ...p, id: uid() }] })),
  updatePaciente: (id, p) =>
    set((s) => ({ pacientes: s.pacientes.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deletePaciente: (id) => set((s) => ({ pacientes: s.pacientes.filter((x) => x.id !== id) })),

  addProfesional: (p) => set((s) => ({ profesionales: [...s.profesionales, { ...p, id: uid() }] })),
  updateProfesional: (id, p) =>
    set((s) => ({ profesionales: s.profesionales.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deleteProfesional: (id) =>
    set((s) => ({ profesionales: s.profesionales.filter((x) => x.id !== id) })),

  addEspecialidad: (e) =>
    set((s) => ({ especialidades: [...s.especialidades, { ...e, id: uid() }] })),
  updateEspecialidad: (id, e) =>
    set((s) => ({
      especialidades: s.especialidades.map((x) => (x.id === id ? { ...x, ...e } : x)),
    })),
  deleteEspecialidad: (id) =>
    set((s) => ({ especialidades: s.especialidades.filter((x) => x.id !== id) })),

  addCita: (c) => set((s) => ({ citas: [...s.citas, { ...c, id: uid() }] })),
  updateCita: (id, c) =>
    set((s) => ({ citas: s.citas.map((x) => (x.id === id ? { ...x, ...c } : x)) })),
  deleteCita: (id) => set((s) => ({ citas: s.citas.filter((x) => x.id !== id) })),

  addMaterial: (m) => set((s) => ({ materiales: [...s.materiales, { ...m, id: uid() }] })),
  updateMaterial: (id, m) =>
    set((s) => ({ materiales: s.materiales.map((x) => (x.id === id ? { ...x, ...m } : x)) })),
  deleteMaterial: (id) => set((s) => ({ materiales: s.materiales.filter((x) => x.id !== id) })),

  addGasto: (g) => set((s) => ({ gastos: [...s.gastos, { ...g, id: uid() }] })),
  updateGasto: (id, g) =>
    set((s) => ({ gastos: s.gastos.map((x) => (x.id === id ? { ...x, ...g } : x)) })),
  deleteGasto: (id) => set((s) => ({ gastos: s.gastos.filter((x) => x.id !== id) })),

  marcarCuotaPagada: (tratamientoId, numero) =>
    set((s) => ({
      tratamientos: s.tratamientos.map((t) =>
        t.id === tratamientoId
          ? {
              ...t,
              cuotas: t.cuotas.map((c) => (c.numero === numero ? { ...c, estado: "Pagado" } : c)),
            }
          : t,
      ),
    })),
}));
