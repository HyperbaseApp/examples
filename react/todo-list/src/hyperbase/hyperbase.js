export default class Hyperbase {
  #_baseUrl;
  #_projectId;
  #_token;

  get baseUrl() {
    return this.#_baseUrl;
  }

  get projectId() {
    return this.#_projectId;
  }

  get token() {
    return this.#_token;
  }

  async init(config) {
    this.#_baseUrl = config.base_url;
    this.#_projectId = config.project_id;

    const res = await this.#api(`/auth/token-based`, {
      method: "POST",
      body: JSON.stringify({
        token_id: config.token_id,
        token: config.token,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    this.#api(`/project/${this.#_projectId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${res.data.token}`,
      },
    });

    this.#_token = res.data.token;
  }

  async setCollection(collectionId) {
    this.#api(`/project/${this.#_projectId}/collection/${collectionId}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${this.#_token}`,
      },
    });

    return new HyperbaseCollection(this, collectionId);
  }

  async #api(input, init) {
    if (input.startsWith("/")) {
      input = input.slice(1);
    }
    const res = await fetch(`${this.#_baseUrl}/api/rest/${input}`, init);
    const resJson = await res.json();
    if (res.status.toString()[0] != "2") {
      throw resJson.error;
    }
    return resJson;
  }
}

class HyperbaseCollection {
  #_hyperbase;
  #_collectionId;

  constructor(hyperbase, collectionId) {
    this.#_hyperbase = hyperbase;
    this.#_collectionId = collectionId;
  }

  async insertOne(object) {
    const res = await this.#api(`/record`, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.#_hyperbase.token}`,
      },
    });

    return res.data;
  }

  async findOne(_id) {
    const res = await this.#api(`/record/${_id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${this.#_hyperbase.token}`,
      },
    });

    return res.data;
  }

  async updateOne(_id, object) {
    const res = await this.#api(`/record/${_id}`, {
      method: "PATCH",
      body: JSON.stringify(object),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.#_hyperbase.token}`,
      },
    });

    return res.data;
  }

  async deleteOne(_id) {
    await this.#api(`/record/${_id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${this.#_hyperbase.token}`,
      },
    });
  }

  async findMany(data) {
    let fields, filters, groups, orders, limit;

    if (data) {
      ({ fields, filters, groups, orders, limit } = data);
    }

    const res = await this.#api(`/records`, {
      method: "POST",
      body: JSON.stringify({
        fields,
        filters,
        groups,
        orders,
        limit,
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.#_hyperbase.token}`,
      },
    });

    return res;
  }

  async #api(input, init) {
    if (input.startsWith("/")) {
      input = input.slice(1);
    }
    const res = await fetch(
      `${this.#_hyperbase.baseUrl}/api/rest/project/${
        this.#_hyperbase.projectId
      }/collection/${this.#_collectionId}/${input}`,
      init
    );
    const resJson = await res.json();
    if (res.status.toString()[0] != "2") {
      throw resJson.error;
    }
    return resJson;
  }
}
