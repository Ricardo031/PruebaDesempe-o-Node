import { User } from "./user.model.js";
import { Clinica } from "./clinica.model.js";
import { Responsable } from "./responsable.model.js";
import { Almacen } from "./almacen.model.js";
import { Medicamento } from "./medicamento.model.js";
import { Inventario } from "./inventario.model.js";
import { Solicitud } from "./solicitud.model.js";

Clinica.hasMany(Responsable, { foreignKey: "clinicaId", as: "responsables" });
Responsable.belongsTo(Clinica, { foreignKey: "clinicaId", as: "clinica" });

Clinica.hasMany(Solicitud, { foreignKey: "clinicaId", as: "solicitudes" });
Solicitud.belongsTo(Clinica, { foreignKey: "clinicaId", as: "clinica" });

Almacen.hasMany(Solicitud, { foreignKey: "almacenId", as: "solicitudes" });
Solicitud.belongsTo(Almacen, { foreignKey: "almacenId", as: "almacen" });

Medicamento.hasMany(Solicitud, { foreignKey: "medicamentoId", as: "solicitudes" });
Solicitud.belongsTo(Medicamento, { foreignKey: "medicamentoId", as: "medicamento" });

Almacen.hasMany(Inventario, { foreignKey: "almacenId", as: "inventarios" });
Inventario.belongsTo(Almacen, { foreignKey: "almacenId", as: "almacen" });

Medicamento.hasMany(Inventario, { foreignKey: "medicamentoId", as: "inventarios" });
Inventario.belongsTo(Medicamento, { foreignKey: "medicamentoId", as: "medicamento" });

export { User, Clinica, Responsable, Almacen, Medicamento, Inventario, Solicitud };
