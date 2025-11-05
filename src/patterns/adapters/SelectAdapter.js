/**
 * Adapter Pattern para transformar datos a formato de react-select
 * Elimina lógica duplicada de mapeo de opciones
 */
class SelectAdapter {
  /**
   * Adapta array de objetos a formato de react-select
   * @param {Array} data - Array de datos
   * @param {string} valueKey - Clave para el valor
   * @param {string} labelKey - Clave para el label
   * @param {Function} labelFormatter - Función opcional para formatear el label
   * @returns {Array} Array de opciones para react-select
   */
  static toSelectOptions(data, valueKey, labelKey, labelFormatter = null) {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => ({
      value: item[valueKey],
      label: labelFormatter ? labelFormatter(item) : item[labelKey],
    }));
  }

  /**
   * Adapta clientes para select
   * @param {Object} clientes - Objeto con initialState de clientes
   * @returns {Array} Opciones de clientes para react-select
   */
  static clienteToSelectOptions(clientes) {
    return this.toSelectOptions(
      clientes?.initialState || [],
      "cliente_id",
      "DNI",
      (cliente) => `${cliente.DNI} - ${cliente.Apellido} ${cliente.Nombre}`
    );
  }

  /**
   * Adapta productos para select
   * @param {Object} productos - Objeto con initialState de productos
   * @returns {Array} Opciones de productos para react-select
   */
  static productoToSelectOptions(productos) {
    return this.toSelectOptions(
      productos?.initialState || [],
      "producto_id",
      "Nombre"
    );
  }

  /**
   * Adapta usuarios/vendedores para select
   * @param {Object} usuarios - Objeto con initialState de usuarios
   * @param {Array} rolesFiltrados - IDs de roles a filtrar (opcional)
   * @returns {Array} Opciones de usuarios para react-select
   */
  static usuarioToSelectOptions(usuarios, rolesFiltrados = null) {
    let usuariosData = usuarios?.initialState || [];

    if (rolesFiltrados && Array.isArray(rolesFiltrados)) {
      usuariosData = usuariosData.filter((usuario) =>
        rolesFiltrados.includes(usuario.rol_id)
      );
    }

    return this.toSelectOptions(
      usuariosData,
      "usuario_id",
      "Nombre",
      (usuario) => `${usuario.Apellido} ${usuario.Nombre}`
    );
  }

  /**
   * Adapta categorías para select
   * @param {Object} categorias - Objeto con categoriasState
   * @returns {Array} Opciones de categorías para select
   */
  static categoriaToSelectOptions(categorias) {
    return this.toSelectOptions(
      categorias || [],
      "categoria_id",
      "nombre"
    );
  }

  /**
   * Adapta obras sociales para select
   * @param {Array} obrasSociales - Array de obras sociales
   * @returns {Array} Opciones de obras sociales para select
   */
  static obraSocialToSelectOptions(obrasSociales) {
    return this.toSelectOptions(
      obrasSociales || [],
      "obra_social_id",
      "obra_social"
    );
  }

  /**
   * Adapta ciudades para select
   * @param {Array} ciudades - Array de ciudades
   * @returns {Array} Opciones de ciudades para select
   */
  static ciudadToSelectOptions(ciudades) {
    return this.toSelectOptions(
      ciudades || [],
      "ciudad_id",
      "ciudad"
    );
  }

  /**
   * Adapta roles para select
   * @param {Array} roles - Array de roles
   * @returns {Array} Opciones de roles para select
   */
  static rolToSelectOptions(roles) {
    return this.toSelectOptions(
      roles || [],
      "rol_id",
      "nombre"
    );
  }
}

export default SelectAdapter;

