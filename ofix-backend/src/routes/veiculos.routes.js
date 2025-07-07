// ARQUIVO: ofix-backend/src/routes/veiculos.routes.js

import { Router } from "express";
// Importa a instância do controller corretamente
import veiculosController from "../controllers/veiculos.controller.js";

const router = Router();

// Associa cada rota ao método correto do controller
router.post("/", veiculosController.createVeiculo);
router.get("/", veiculosController.getAllVeiculos);
router.get("/:id", veiculosController.getVeiculoById);
router.put("/:id", veiculosController.updateVeiculo);
router.delete("/:id", veiculosController.deleteVeiculo);

export default router;
