<template>
  <v-card elevation="0">
    <section>
      <v-col>
        <small>Bandeja de Inscritos / Trámite {{ codigo }}</small>
        <p>&nbsp;</p>
        <h2>Código de Trámite {{ codigo }}</h2>
        <p>{{ descripcion }}</p>
        <div>
          <small>Estado:
              <v-chip
              label color="primary"
              small
              class="text-capitalize"
            >{{ estado || 'inscrito' }}</v-chip>
          </small>
        </div>
        <div><small>Empresa: <span>{{ nombre }}</span></small></div>
      </v-col>
    </section>
    <p>&nbsp;</p>
    <v-container>
      <div class="mt-4 mb-4"><h3>Confirmación de Inscripción</h3></div>
      <div class="mt-2 mb-2">El trámite concluyó satisfactoriamente
        y la nueva empresa se registro en el registro de comercio.</div>
      <div class="mt-2 mb-2">Se ejecutaron los siguientes procesos.</div>
      <div class="d-flex mt-2 mb-2">
        <div><v-icon color="success" >check_circle</v-icon></div>
        <div class="pl-2">Publicación en la Gaceta del Registro de comercio</div>
      </div>
      <div class="d-flex mt-2 mb-2">
        <div><v-icon color="success">check_circle</v-icon></div>
        <div class="pl-2">Incripción en el Registro de Comercio</div>
      </div>
      <div class="d-flex mt-2 mb-2">
        <div><v-icon color="success">check_circle</v-icon></div>
        <div class="pl-2">Registro en Kardex</div>
      </div>
    </v-container>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    nombre: '',
    codigo: '',
    estado: '',
    descripcion:
      'Inscripción de Comerciante Individual o Empresa Unipesonal - Tramite 01',
  }),
};
</script>
