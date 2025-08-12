
export async function get(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error with GET:", error);
  }
}

export async function get_id(url, id) {
  try {
    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error with GET:", error);
  }
}

export async function post(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error with POST:", error);
  }
}

export async function update(url, id, body) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // body have to be a objet like { title, body, userId }
    });

    const data = await response.json();
    console.log("PATCH update:", data);
    return data;
  } catch (error) {
    console.error("Error with PATCH:", error);
    throw error;
  }
}

export async function deletes(url, id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("DELETE: object delet correct");
      return true;
    } else {
      console.error("Error on delet");
      return false;
    }
  } catch (error) {
    console.error("Error with DELETE:", error);
    throw error;
  }
}
