/* A builder class to simplify the task of creating HTML elements */
class ElementCreator {
    constructor(tag) {
        this.element = document.createElement(tag);
    }

    id(id) {
        this.element.id = id;
        return this;
    }

    class(clazz) {
        this.element.class = clazz;
        return this;
    }

    text(content) {
        this.element.innerHTML = content;
        return this;
    }

    with(name, value) {
        this.element.setAttribute(name, value)
        return this;
    }

    listener(name, listener) {
        this.element.addEventListener(name, listener)
        return this;
    }

    append(child) {
        child.appendTo(this.element);
        return this;
    }

    prependTo(parent) {
        parent.prepend(this.element);
        return this.element;
    }

    appendTo(parent) {
        parent.append(this.element);
        return this.element;
    }

    insertBefore(parent, sibling) {
        parent.insertBefore(this.element, sibling);
        return this.element;
    }

    replace(parent, sibling) {
        parent.replaceChild(this.element, sibling);
        return this.element;
    }
}

/* A class representing a resource. This class is used per default when receiving the
   available resources from the server (see end of this file).
   You can (and probably should) rename this class to match with whatever name you
   used for your resource on the server-side.
 */
class Animal {

    /* If you want to know more about this form of getters, read this:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get */
    get idforDOM() {
        return `resource-${this.id}`;
    }

}

function add(resource, sibling) {

    const creator = new ElementCreator("article")
        .id(resource.idforDOM);

    /* Task 2: Instead of the name property of the example resource, add the properties of
       your resource to the DOM. If you do not have the name property in your resource,
       start by removing the h2 element that currently represents the name. For the 
       properties of your object you can use whatever html element you feel represents
       your data best, e.g., h2, paragraphs, spans, ... 
       Also, you don't have to use the ElementCreator if you don't want to and add the
       elements manually. */
    creator
        .append(new ElementCreator("h2").text(resource.animalSpecies))
    creator
        .append(new ElementCreator("p").text("Animal name: " + resource.name))
    creator
        .append(new ElementCreator("p").text("Age (year): " + resource.age))
    creator
        .append(new ElementCreator("p").text("Sterilized: " + resource.isSterilized))

    creator
        .append(new ElementCreator("button").text("Edit").listener('click', () => {
            edit(resource);
        }))
        .append(new ElementCreator("button").text("Remove").listener('click', () => {
            /* Task 3: Call the delete endpoint asynchronously using either an XMLHttpRequest
               or the Fetch API. Once the call returns successfully, remove the resource from
               the DOM using the call to remove(...) below. */

            fetch(url = `/api/resources/${resource.id}`, {
                method: "DELETE",})
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("data process error");
                    }
                    remove(resource);
                    console.log("Animal deletion successful.")
                })
                .catch((error) => {
                    console.error("Network Error: ", error);
                });
            //remove(resource);  // <- This call removes the resource from the DOM. Call it after (and only if) your API call succeeds!
        }));

    const parent = document.querySelector('main');

    if (sibling) {
        creator.replace(parent, sibling);
    } else {
        creator.insertBefore(parent, document.querySelector('#bottom'));
    }
}

function edit(resource) {
    const formCreator = new ElementCreator("form")
        .id(resource.idforDOM)
        .append(new ElementCreator("h3").text("Edit " + resource.animalSpecies + " " + resource.name));
    
    /* Task 4 - Part 1: Instead of the name property, add the properties your resource has here!
       The label and input element used here are just an example of how you can edit a
       property of a resource, in the case of our example property name this is a label and an
       input field. Also, we assign the input field a unique id attribute to be able to identify
       it easily later when the user saves the edited data (see Task 4 - Part 2 below). 
    */
    formCreator
        .append(new ElementCreator("label").text("Animal species").with("for", "resource-animalSpecies"))
        .append(new ElementCreator("input").id("resource-animalSpecies").with("type", "text").with("value", resource.animalSpecies))
        .append(new ElementCreator("p"))  
    formCreator
        .append(new ElementCreator("label").text("Name").with("for", "resource-name"))
        .append(new ElementCreator("input").id("resource-name").with("type", "text").with("value", resource.name))
        .append(new ElementCreator("p"))  
    formCreator
        .append(new ElementCreator("label").text("Age").with("for", "resource-age"))
        .append(new ElementCreator("input").id("resource-age").with("type", "text").with("value", resource.age))
        .append(new ElementCreator("p"))
    formCreator
        .append(new ElementCreator("label").text("Sterilized:  ").with("for", "resource-isSterilized"))
        .append(new ElementCreator("label").text("True").with("for", "resource-isSterilized-yt").with("value", "true"))
        .append(new ElementCreator("input").id("resource-isSterilized-y").with("type", "radio").with("name", "resource-isSterilized").with("value", "true"))
        .append(new ElementCreator("label").text(" False").with("for", "resource-isSterilized-nt"))
        .append(new ElementCreator("input").id("resource-isSterilized-n").with("type", "radio").with("name", "resource-isSterilized").with("value", "false"))
        .append(new ElementCreator("p"));

    /* In the end, we add the code to handle saving the resource on the server and terminating edit mode */
    formCreator
        .append(new ElementCreator("button").text("Speichern").listener('click', (event) => {
            /* Why do we have to prevent the default action? Try commenting this line. */
            event.preventDefault();

            /* The user saves the resource.
               Task 4 - Part 2: We manually set the edited values from the input elements to the resource object. 
               Again, this code here is just an example of how the name of our example resource can be obtained
               and set in to the resource. The idea is that you handle your own properties here.
            */
            resource.animalSpecies = document.getElementById("resource-animalSpecies").value;
            resource.name = document.getElementById("resource-name").value;
            resource.age = document.getElementById("resource-age").value;
            resource.isSterilized = document.getElementById(resource.idforDOM).querySelector('input[name="resource-isSterilized"]:checked');
            
            // Optional: Check if a radio button is selected
            if (resource.isSterilized) {
            const selectedValue = resource.isSterilized.value;
            resource.isSterilized = resource.isSterilized.value;
            console.log("Selected Value:", selectedValue);
            } else {
                console.log("No radio button selected");
            }

            /* Task 4 - Part 3: Call the update endpoint asynchronously. Once the call returns successfully,
               use the code below to remove the form we used for editing and again render 
               the resource in the list.
            */
            fetch(url = `/api/resources/${resource.id}`, {
                method: "PUT",})
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("data process error");
                    }
                    add(resource, document.getElementById(resource.idforDOM));  // <- Call this after the resource is updated successfully on the server
                    console.log("Resource added successfully.")
                })
                .catch((error) => {
                    console.error("Network Error: ", error);
                });          
        }))
        .replace(document.querySelector('main'), document.getElementById(resource.idforDOM));
}

function remove(resource) {
    document.getElementById(resource.idforDOM).remove();
}

/* Task 5 - Create a new resource is very similar to updating a resource. First, you add
   an empty form to the DOM with the exact same fields you used to edit a resource.
   Instead of PUTing the resource to the server, you POST it and add the resource that
   the server returns to the DOM (Remember, the resource returned by the server is the
    one that contains an id).
 */
function create() {
    //alert("Not implemeted yet!");
    // set new id.

    const newAnimal = new Animal();

    const formCreator = new ElementCreator("form")
        .id(newAnimal.idforDOM) //.id(newAnimal.idforDOM)
        .append(new ElementCreator("h3").text("Create new animal:"));
    formCreator
        .append(new ElementCreator("label").text("Animal species").with("for", "resource-animalSpecies"))
        .append(new ElementCreator("input").id("resource-animalSpecies").with("type", "text"))
        .append(new ElementCreator("p"))  
    formCreator
        .append(new ElementCreator("label").text("Name").with("for", "resource-name"))
        .append(new ElementCreator("input").id("resource-name").with("type", "text"))
        .append(new ElementCreator("p"))  
    formCreator
        .append(new ElementCreator("label").text("Age").with("for", "resource-age"))
        .append(new ElementCreator("input").id("resource-age").with("type", "text"))
        .append(new ElementCreator("p"))
    formCreator
        .append(new ElementCreator("label").text("Sterilized:  ").with("for", "resource-isSterilized-l"))
        .append(new ElementCreator("label").text("True").with("for", "resource-isSterilized-yt").with("value", "true"))
        .append(new ElementCreator("input").id("resource-isSterilized-y").with("type", "radio").with("name", "resource-isSterilized").with("value", "true"))
        .append(new ElementCreator("label").text(" False").with("for", "resource-isSterilized-nt"))
        .append(new ElementCreator("input").id("resource-isSterilized-n").with("type", "radio").with("name", "resource-isSterilized").with("value", "false"))
        .append(new ElementCreator("p"));

    formCreator
        .append(new ElementCreator("button").text("Save").listener("click", (event) => {
            event.preventDefault();

            newAnimal.animalSpecies = document.getElementById("resource-animalSpecies").value;
            newAnimal.name = document.getElementById("resource-name").value;
            newAnimal.age = document.getElementById("resource-age").value;
            newAnimal.isSterilized = document.getElementById(newAnimal.idforDOM).querySelector('input[name="resource-isSterilized"]:checked');

            // Optional: Check if a radio button is selected
            if (newAnimal.isSterilized) {
                const selectedValue = resource.isSterilized.value;
                newAnimal.isSterilized = resource.isSterilized.value;
                console.log("Selected Value:", selectedValue);
            } else {
                console.log("No radio button selected");
            }
            
            // resource.animalSpecies = document.getElementById("resource-animalSpecies").value;
            // resource.name = document.getElementById("resource-name").value;
            // resource.age = document.getElementById("resource-age").value;
            // resource.isSterilized = document.getElementById(resource.idforDOM).querySelector('input[name="resource-isSterilized"]:checked').value;

        }))
    
    fetch(url = `/api/resources`, {
        method: "POST",
        body: JSON.stringify(newAnimal)})
        .then((response) => {
            if (!response.ok) {
                throw new Error("data process error");
            }
            add(newAnimal, document.getElementById(newAnimal.idforDOM));  // <- Call this after the resource is updated successfully on the server
            console.log("New resource on server created successfully.")
        })
        .catch((error) => {
            console.error("Network Error: ", error);
        });     


    //Clear all fields
    // document.getElementById("resource-animalSpecies").value = "";
    // document.getElementById("resource-name").value = "";
    // document.getElementById("resource-age").value = "";
    // const isSterilizedRadioButtons = document.querySelectorAll('input[name="resource-isSterilized"]');
    // for (const radio of isSterilizedRadioButtons) {
    //     radio.checked = false;
    // }
    // Add to DOM
    formCreator.appendTo(document.querySelector("main"));
}
    

document.addEventListener("DOMContentLoaded", function (event) {

    fetch("/api/resources")
        .then(response => response.json())
        .then(resources => {
            for (const resource of resources) {
                add(Object.assign(new Animal(), resource));
            }
        });
});

