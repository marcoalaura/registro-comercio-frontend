<template>
  <v-card elevation="0">
    <section>
      <v-col>
        <small>Bandeja de Pendientes / Trámite {{ codigo }}</small>
        <p>&nbsp;</p>
        <h2>Código de Trámite {{ codigo }}</h2>
        <p>{{ descripcion }}</p>
        <div>
          <small>Estado:
              <v-chip
              label color="primary"
              small
              class="text-capitalize"
            >{{ estado }}</v-chip>
          </small>
        </div>
        <div><small>Empresa: <span>{{ nombre }}</span></small></div>
      </v-col>
    </section>
    <p>&nbsp;</p>
    <section class="tramite">
      <v-col>
        <small>En esta sección podrás realizar la revisión del
          trámite previamente seleccionado.</small>
        <div class="pa-2" style="border:1px solid #eee;">
          <v-btn v-if="false" small elevation="0" class="ma-1">
            <v-icon-component icon="save" />
            GUARDAR
          </v-btn>
          <v-btn small elevation="0" class="ma-1" color="primary">
            <v-icon-component icon="drive_file_rename_outline" />
            Firmar documentos
          </v-btn>
          <v-btn
            v-if="!tramiteObservado"
            @click="enviarAprobado()"
            color="success"
            small elevation="0" class="ma-1">
            <v-icon-component icon="check_circle" />
            Aprobar
          </v-btn>
          <v-btn
            v-if="tramiteObservado"
            color="warning"
            small elevation="0" class="ma-1"
            @click="enviarObservado()"
          >
            <v-icon-component icon="unpublished" />
            Enviar observaciones
          </v-btn>
          <v-btn small elevation="0" class="ma-1" @click="cancelarRevision()">
            <v-icon-component icon="keyboard_return" />
            Cancelar
          </v-btn>
        </div>
      </v-col>
      <v-expansion-panels>
        <!-- DATOS DE LA EMPRESA -->
        <v-expansion-panel v-for="(grupo, iGrupo) in grupos" v-bind:key="iGrupo">
          <v-expansion-panel-header class="text-capitalice">
            {{ iGrupo+1 }} {{ grupo.nombre }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(seccion, iSeccion) in grupo.secciones"
              v-bind:key="iSeccion" style="overflow:auto;">
              <hr class="mt-1">
              <p class="mb-0 text-uppercase">{{ seccion.nombre }}</p>
              <table class="tabla" v-if="seccion.campos.length">
                <thead>
                  <tr>
                    <th width="5%"><small>Acciones</small></th>
                    <th width="30%" class="text-left"><small>Casilla</small></th>
                    <th width="30%" class="text-left"><small>Valor</small></th>
                    <th width="30%" class="text-left"><small>Observación</small></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(campo, iCampo) in seccion.campos" v-bind:key="campo.id">
                    <td class="text-center">
                      <v-tooltip top v-if="campo.acciones.add">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon
                            v-bind="attrs"
                            v-on="on"
                            @click="agregarObs(campo, [iGrupo, iSeccion, iCampo])">
                            <v-icon-component icon="playlist_add" />
                          </v-btn>
                        </template>
                        <span>Agregar observación</span>
                      </v-tooltip>
                      <v-tooltip top v-if="campo.acciones.del">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon
                            v-bind="attrs"
                            v-on="on"
                            @click="eliminarObs(campo, [iGrupo, iSeccion, iCampo])">
                            <v-icon-component icon="delete_sweep" />
                          </v-btn>
                        </template>
                        <span>Eliminar observación</span>
                      </v-tooltip>
                    </td>
                    <td>
                      <div class="mt-2" style="float:left">{{ campo.label }}</div>
                      <v-tooltip
                        v-if="campo.ayuda"
                        top
                        color="#eee"
                        class="ayuda"
                        :open-on-hover="false"
                        v-model="campo.tooltip"
                      >
                        <template v-slot:activator="{}">
                          <v-btn
                            icon
                            @click="campo.tooltip = !campo.tooltip"
                            @mouseleave="campo.tooltip = false"
                            style="float:right">
                            <v-icon style="float:right">help_outline</v-icon>
                          </v-btn>
                        </template>
                        <span class="ayuda">{{ campo.ayuda }}</span>
                      </v-tooltip>
                      <v-tooltip top v-if="campo.observacion">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            color="orange"
                            style="float:right"
                          >
                            <v-icon>warning</v-icon>
                          </v-btn>
                        </template>
                        <span>Observado</span>
                      </v-tooltip>
                    </td>
                    <td>{{ campo.valor }}</td>
                    <td>{{ campo.observacion }}</td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="!seccion.campos.length"
                class="text-center">No existen campos</div>
            </div>
            <div
              v-if="!grupo.secciones.length"
              class="text-center">No existen secciones</div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- DOCUMENTOS SOPORTE -->
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ this.grupos.length + 1}} Documentos soporte
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(seccion, iSeccion) in grupoSoporte.secciones"
              v-bind:key="iSeccion" style="overflow:auto;">
              <hr class="mt-1">
              <p class="mb-0">{{ seccion.nombre }}</p>
              <table class="tabla">
                <thead>
                  <tr>
                    <th><small>Acciones</small></th>
                    <th class="text-left"><small>Tipo de Documento</small></th>
                    <th class="text-left"><small>Número de Documento</small></th>
                    <th class="text-left"><small>Emisor</small></th>
                    <th class="text-left"><small>Fecha de Emisión</small></th>
                    <th class="text-left"><small>Nombre del documento</small></th>
                    <th class="text-left"><small>Observación</small></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(campo, iCampo) in seccion.campos" v-bind:key="iCampo">
                    <td class="text-center">
                      <v-tooltip top v-if="campo.acciones.add">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon
                            v-bind="attrs"
                            v-on="on"
                            @click="agregarObs(campo, ['gSoporte', iSeccion, iCampo])">
                            <v-icon-component icon="playlist_add" />
                          </v-btn>
                        </template>
                        <span>Agregar observacion</span>
                      </v-tooltip>
                      <v-tooltip top v-if="campo.acciones.del">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon
                            v-bind="attrs"
                            v-on="on"
                            @click="eliminarObs(campo, ['gSoporte', iSeccion, iCampo])">
                            <v-icon-component icon="delete_sweep" />
                          </v-btn>
                        </template>
                        <span>Eliminar observación</span>
                      </v-tooltip>
                    </td>
                    <td>{{ campo.tipo_documento }}</td>
                    <td>{{ campo.nro_documento }}</td>
                    <td>{{ campo.emisor }}</td>
                    <td>{{ campo.fecha_emision }}</td>
                    <td>{{ truncate(campo.nombre_documento, 40) }}</td>
                    <td>{{ campo.observacion }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>
    <section class="mt-6 tramite">
      <v-col>
        <h3>Observaciones generales</h3>
        <table class="tabla">
          <thead>
            <tr>
              <th width="5%"><small>Acciones</small></th>
              <th width="95%" class="text-left"><small>Observación</small></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obs, index) in obsGenerales" v-bind:key="index">
              <td class="text-center">
                <v-btn icon @click="eliminarObsGral(index, obs)">
                  <v-icon-component icon="delete_forever" />
                </v-btn>
              </td>
              <td>{{ obs.observacion }}</td>
            </tr>
            <tr>
              <td class="text-center">
                <v-btn icon @click="agregarObsGral()">
                  <v-icon-component icon="add" />
                </v-btn>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </section>
    <section>
      <v-dialog
        v-model="dialogAgregarObs"
        persistent
        width="360"
      >
        <v-card>
          <v-card-title>
            Agregar observación
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12"><strong>campo:</strong> {{ campo.label }}</v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="campo.observacion"
                  label="Observaciones"
                  autofocus
                  counter
                  maxlength="512"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn elevation="0" type="button" @click="cancelarObs()">CANCELAR</v-btn>
            <v-btn
              elevation="0"
              type="button"
              color="primary"
              @click="guardarObs(campo)"
              :disabled="!campo.observacion"
            >AGREGAR</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogAgregarObsGral"
        persistent
        width="360"
      >
        <v-card>
          <v-card-title>
            Agregar observación general
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="campo.observacion"
                  label="Observaciones"
                  autofocus
                  counter
                  maxlength="512"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn elevation="0" type="button" @click="cancelarObsGral()">CANCELAR</v-btn>
            <v-btn
              elevation="0"
              type="button"
              color="primary"
              @click="guardarObsGral(campo)"
            >AGREGAR</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
  </v-card>
</template>
<script>
/* eslint max-lines: 0 */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
const grupos = [
  {
    nombre: 'Datos de la empresa',
    descripcion: 'Datos de la empresa',
    secciones: [
      {
        nombre: 'TIPO DE UNIDAD Y RAZÓN SOCIAL',
        descripcion: 'TIPO DE UNIDAD Y RAZÓN SOCIAL',
        campos: [{
          acciones: {},
          campo: 'tipo_unidad_economica',
          label: 'Tipo de Unidad Económica',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'razon_social',
          label: 'Razón Social',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'Objeto Social',
          label: 'Objeto Social',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }]
      },
      {
        nombre: 'INFORMACIÓN FINANCIERA',
        descripcion: 'INFORMACIÓN FINANCIERA',
        campos: [{
          acciones: {},
          campo: 'monto_capital',
          label: 'Monto de Capital',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }]
      },
      {
        nombre: 'ACTIVIDADES ECONÓMICAS',
        descripcion: 'ACTIVIDADES ECONÓMICAS',
        campos: [{
          acciones: {},
          campo: 'actividad_principal',
          label: 'Actividad Económica Principal',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'actividad_secundaria',
          label: 'Actividades Económicas Secundarias',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'cierre_gestion',
          label: 'Cierre de Gestión',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }]
      },
      {
        nombre: 'DENOMINACIÓN',
        descripcion: 'DENOMINACIÓN',
        campos: [{
          acciones: { add: true },
          campo: 'denominacion',
          label: 'Denominación de la empresa',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }]
      },
    ],
  },
  {
    nombre: 'Datos del propietario',
    descripcion: 'Datos del propietario',
    secciones: [
      {
        nombre: 'DOCUMENTO DE IDENTIFICACIÓN',
        descripcion: 'DOCUMENTO DE IDENTIFICACIÓN',
        campos: [{
          acciones: {},
          campo: 'tipo_documento',
          label: 'Tipo de Documento de Identificación',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'numero_documento',
          label: 'Número de Documento',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }]
      },
      {
        nombre: 'DATOS PERSONALES',
        descripcion: 'DATOS PERSONALES',
        campos: [{
          acciones: {},
          campo: 'nombres',
          label: 'Nombre(s)',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'primer_apellido',
          label: 'Primer Apellido',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'segundo_apellido',
          label: 'Segundo Apellido',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'apellido_casada',
          label: 'Apellido Casada',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'genero',
          label: 'Género',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'fecha_nacimiento',
          label: 'Fecha de Nacimiento',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }]
      },
      {
        nombre: 'DATOS DE CONTACTO DEL PROPIETARIO',
        descripcion: 'DATOS DE CONTACTO DEL PROPIETARIO',
        campos: [{
          acciones: {},
          campo: 'numero_celular',
          label: 'Número de Celular',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'correo_electronico',
          label: 'Correo Electrónico',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'telefonos',
          label: 'Teléfono fijo',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }]
      },
    ],
  },
  {
    nombre: 'Dirección comercial',
    descripcion: 'Dirección comercial',
    secciones: [
      {
        nombre: 'UBICACIÓN DEL COMERCIO',
        descripcion: 'UBICACIÓN DEL COMERCIO',
        campos: [{
          acciones: { add: true },
          campo: 'departamento',
          label: 'Departamento',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'provincia',
          label: 'Provincia',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'municipio',
          label: 'Municipio',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'tipo_geografico',
          label: 'Tipo de División Geográfica',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'nombre_geografico',
          label: 'Nombre División Geográfica',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'tipo_via',
          label: 'Tipo de vía',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'nombre_via',
          label: 'Nombre de Vía',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'direccion_referencial',
          label: 'Dirección Referencial',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'numero_domicilio',
          label: 'Número de domicilio',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'edificio',
          label: 'Edificio',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'piso',
          label: 'Piso',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: {},
          campo: 'tipo_ambiente',
          label: 'Tipo ambiente',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'nombre_ambiente',
          label: 'Número o Nombre de ambiente',
          ayuda: 'Verifique que el valor corresponda',
          tooltip: false,
          observacion: '',
        }, {
          acciones: { add: true },
          campo: 'ubicacion',
          label: 'Ubicación',
          ayuda: '',
          tooltip: false,
          observacion: '',
        }]
      },
    ],
  },
];
const grupoSoporte = {
  nombre: 'Documentos soporte',
  descripcion: 'Documentos soporte',
  secciones: [
    {
      nombre: '',
      descripcion: '',
      campos: [{
        acciones: { add: true },
        tipo_documento: 'Autorización ente regulador',
        nro_documento: '33440031',
        emisor: 'ASFI',
        fecha_emision: '25/05/2021',
        nombre_documento: 'AUTORIZACIÓN-ASFI.pdf',
        observacion: '',
      }]
    },
  ],
};

export default {
  data: () => ({
    nombre: '',
    codigo: '',
    estado: '',
    descripcion:
      'Inscripción de Comerciante Individual o Empresa Unipesonal - Tramite 01',
    grupos,
    grupoSoporte,
    obsGenerales: [],
    dialogAgregarObs: false,
    dialogAgregarObsGral: false,
    campo: {},
    tramiteObservado: false,
  }),
  methods: {
    truncate(value, size) {
      if (!value) return '';
      value = value.toString();
      if (value.length <= size) {
        return value;
      }
      return `${value.substr(0, (size - 7) / 2)}... ...${value.substr(-(size - 7) / 2)}`;
    },
    agregarObs(campo, opts) {
      if (!opts || !opts[0] < 0 || opts[1] < 0 || !opts[2] < 0) {
        console.error('tabla,campo no seleccionada!', opts);
        return;
      }
      this.campo = {
        iGrupo: opts[0],
        iSeccion: opts[1],
        iCampo: opts[2],
        ...campo
      };
      this.dialogAgregarObs = true;
    },
    guardarObs(obs) {
      let filaCampo = {};
      let url = `juridico/observacion/${this.$route.params.codigo}/`;
      if (this.campo.tipo === 'file') {
        url = url + `documento/${this.campo.idCampo}`;
        filaCampo = this.grupoSoporte.secciones[obs.iSeccion].campos[obs.iCampo];
      } else {
        url = url + `detalle/${this.campo.idCampo}`;
        filaCampo = this.grupos[obs.iGrupo].secciones[obs.iSeccion].campos[obs.iCampo];
      }
      if (obs.observacion) {
        this.$service.put(
          url,
          {
            observacion: obs.observacion,
          }
        ).then((resp) => {
          if (resp && resp.finalizado) {
            filaCampo.observacion = obs.observacion;
            filaCampo.acciones.add = false;
            filaCampo.acciones.del = true;
            if (resp.datos && resp.datos.length === 1) {
              filaCampo.idObs = resp.datos[0].id;
            }
            this.dialogAgregarObs = false;
            this.tramiteObservado = true;
          }
        });
      } else {
        if (filaCampo.observacion) {
          this.$service.put(
            `juridico/observacion/${
              this.$route.params.codigo
            }/inactivar/${filaCampo.idObs}`
          ).then((resp) => {
            if (resp && resp.finalizado) {
              filaCampo.observacion = '';
              this.dialogAgregarObs = false;
            }
          });
        }
      }
    },
    cancelarObs() {
      this.campo = {};
      this.dialogAgregarObs = false;
    },
    eliminarObs(campo, opts) {
      this.$confirm({
        title: 'Eliminar observación',
        text: '¿Desea eliminar la observación?',
        textOk: 'SI',
        textCancel: 'NO',
        callbackOk: () => {
          const obs = {
            iGrupo: opts[0],
            iSeccion: opts[1],
            iCampo: opts[2],
            ...campo
          };
          let filaCampo = {};
          if (campo.tipo === 'file') {
            filaCampo = this.grupoSoporte.secciones[obs.iSeccion].campos[obs.iCampo];
          } else {
            filaCampo = this.grupos[obs.iGrupo].secciones[obs.iSeccion]
              .campos[obs.iCampo];
          }
          this.$service.put(
            `juridico/observacion/${
              this.$route.params.codigo
            }/inactivar/${filaCampo.idObs}`
          ).then((resp) => {
            if (resp && resp.finalizado) {
              filaCampo.observacion = '';
              filaCampo.acciones.add = true;
              filaCampo.acciones.del = false;
              this.contarObsevaciones();
            }
          });
        }
      });
    },
    // Observaciones generales
    agregarObsGral() {
      this.campo = {};
      this.dialogAgregarObsGral = true;
    },
    eliminarObsGral(index, obs) {
      this.$confirm({
        title: 'Eliminar observación',
        text: '¿Desea eliminar la observación?',
        textOk: 'SI',
        textCancel: 'NO',
        callbackOk: () => {
          this.$service.put(
            `juridico/observacion/${
              this.$route.params.codigo
            }/inactivar/${obs.idObs}`
          ).then((resp) => {
            if (resp.finalizado) {
              this.obsGenerales.splice(index, 1);
              this.contarObsevaciones();
            }
          });
        }
      });
    },
    guardarObsGral(obs) {
      this.$service.post(`juridico/observacion/${this.$route.params.codigo}/tramite`, {
        observacion: obs.observacion
      }).then((resp) => {
        if (resp && resp.finalizado) {
          if (resp.datos && resp.datos.length === 1) {
            this.obsGenerales.push({
              idObs: resp.datos[0].id,
              observacion: obs.observacion
            });
            this.tramiteObservado = true;
            this.dialogAgregarObsGral = false;
          }
        }
      });
    },
    cancelarObsGral() {
      this.campo = {};
      this.dialogAgregarObsGral = false;
    },
    cancelarRevision() {
      this.$router.push('/juridico/pendientes');
    },
    // Anviar Aprobado
    enviarAprobado () {
      this.$confirm({
        text: '¿Esta seguro(a) de aprobar el trámite?',
        callbackOk: () => {
          console.log('OK Aprobado!!!');
          this.$service
            .put(`juridico/pendientes/${this.$route.params.codigo}/aprobado`)
            .then((resp) => {
              if (resp && resp.finalizado) {
                this.$message.success(resp.mensaje);
                this.$router.push('/juridico/pendientes');
              }
            });
        }
      });
    },
    // Enviar a bandeja de observados
    contarObsevaciones() {
      let cantidad = this.obsGenerales.length;
      for (const seccion of this.grupoSoporte.secciones) {
        for (const campo of seccion.campos) {
          if (campo.observacion) cantidad++;
        }
      }
      for (const grupo of this.grupos) {
        for (const seccion of grupo.secciones) {
          for (const campo of seccion.campos) {
            if (campo.observacion) cantidad++;
          }
        }
      }
      if (cantidad) {
        this.tramiteObservado = true;
      } else {
        this.tramiteObservado = false;
      }
      return cantidad;
    },
    enviarObservado() {
      this.$confirm({
        text: '¿Esta seguro(a) de enviar las observaciones?',
        callbackOk: () => {
          this.$service
            .put(`juridico/pendientes/${this.$route.params.codigo}/observado`)
            .then((resp) => {
              if (resp && resp.finalizado) {
                this.$message.success(resp.mensaje);
                this.$router.push('/juridico/pendientes');
              }
            });
        }
      });
    },
  },
  async mounted() {
    if (!this.$route.params.codigo) {
      this.$message.warning('Código es necesario.');
      this.$router.replace('/juridico/pendientes');
    }
    let tramite = {};
    try {
      const resp = await this.$service.get(
        `juridico/observacion/${this.$route.params.codigo}`
      );
      if (resp.finalizado && resp.datos) {
        [tramite] = resp.datos;
        if (tramite.observaciones.length) {
          this.tramiteObservado = true;
        }
        this.obsGenerales = tramite.observaciones.map((o) => ({
          idObs: o.id,
          observacion: o.observacion
        }));
      }
    } catch (error) {
      console.error('Obtener observaciones:', error);
      this.$message.error(error.mensaje || error.message);
    }
    // this.$route.params.codigo = 1;
    this.$service.get(`tramites/${this.$route.params.codigo}/genericos`)
      .then((resp) => {
        if (resp.finalizado) {
          this.grupos = [];
          const files = this.grupoSoporte.secciones[0];
          this.codigo = resp.datos.codigo;
          this.estado = resp.datos.estado;
          if (!resp.datos || !resp.datos.grupos || !resp.datos.grupos.length) return;
          // const files = {
          //   nombre: '',
          //   campos: [],
          // };
          files.campos = [];
          this.grupos = resp.datos.grupos.map((g) => {
            console.info('grupo', g.nombre);
            return {
              descripcion: g.descripcion,
              nombre: g.nombre,
              secciones: g.secciones.filter((s) => {
                // Filtrar campos file, ...
                for (const c of s.campos) {
                  if (c.tipo === 'file') {
                    let obs = tramite.documentos.find((o) => (
                      o.id === c.idCampo
                    ));
                    obs = obs && obs.observaciones[0];
                    if (obs && obs.observacion) this.tramiteObservado = true;
                    files.campos.push({
                      id: c.id,
                      idObs: obs && obs.id,
                      idCampo: c.idCampo,
                      acciones: {
                        add: c.valor !== null
                          && !(obs && obs.observacion),
                        del: c.valor !== null
                          && !!(obs && obs.observacion),
                      },
                      campo: c.campo,
                      tipo_documento: c.codigoTipoDocumento,
                      nombre_documento: c.nombre,
                      observacion: (obs && obs.observacion) || '',
                      tipo: c.tipo,
                    });
                  }
                }
                return s;
              }).map((s) => ({
                nombre: s.nombre,
                descripcion: s.descripcion,
                campos: s.campos.filter((c) => {
                  const esFile = files.campos.find((f) => (c.campo.startsWith(f.campo)));
                  if (esFile && !c.campo.endsWith(esFile.campo)) {
                    // buscar campos  file_[valor]
                    esFile[c.campo.replace(`${esFile.campo}_`, '')] = c.valor;
                  }
                  return !esFile;
                }).map((c) => {
                  let obs = tramite.detalles.find((o) => (
                    o.id === c.idCampo
                  ));
                  obs = obs && obs.observaciones[0];
                  if (obs && obs.observacion) this.tramiteObservado = true;
                  const campo = {
                    id: c.id,
                    idObs: obs && obs.id,
                    idCampo: c.idCampo,
                    acciones: {
                      add: c.valor !== null
                        && !(obs && obs.observacion),
                      del: c.valor !== null
                        && !!(obs && obs.observacion),
                    },
                    campo: c.campo,
                    label: c.label,
                    ayuda: 'Verifique que el valor corresponda',
                    tooltip: false,
                    valor: c.valor,
                    observacion: (obs && obs.observacion) || '',
                  };
                  return campo;
                }),
              })),
            };
          }).filter((g2) => {
            // verificar secciones y campos
            if (g2.secciones.length && g2.secciones[0].campos.length) return true;
            return false;
          });
          this.grupoSoporte.secciones = this.grupoSoporte.secciones.filter((s) => {
            if (s.campos.length) return true;
            return false;
          });
        }
      });
  },
};
</script>
<style lang="scss" scoped>
  .tramite {
    .tabla {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      th {
        border: 1px solid #eee;
        padding: 4px;
        font-weight: bold !important;
      }
      td {
        border: 1px solid #eee;
        padding: 4px;
        vertical-align: middle;
        height: 42px;
      }
    }
  }
  .v-tooltip__content {
    .ayuda {
      color: #000 !important;
    }
  }
</style>
