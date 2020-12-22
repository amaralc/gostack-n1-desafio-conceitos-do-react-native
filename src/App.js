import React, {useState, useEffect, useCallback} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from './services/api';

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/repositories').then((response) => {
      setProjects(response.data);
    });   
  }, [projects]);

  async function handleLikeRepository(id) {

    // Implement "Like Repository" functionality
    await api.post(`/repositories/${id}/like`)

    // Create new list of projects
    let localProjects = projects.map(project => {
      return Object.assign({}, project)
    });   

    // Get repository index in projects list
    const likedProjectIndex = localProjects.findIndex(project => {return project.id === id});

    // Get liked project
    let likedProject = localProjects[likedProjectIndex]; 

    // Add one to the number of likes
    likedProject.likes += 1;     
    
    // Update projects locally
    setProjects(localProjects)
     
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
      <FlatList
          data={projects}
          keyExtractor={(project) => project.id}
          renderItem={({item: project}) => (
            <View style={styles.repositoryContainer} key={project.id}>
              <Text style={styles.repository}>{project.title}</Text>

              <View style={styles.techsContainer}>
              {project.techs && project.techs.map(tech => {
                  return(
                    <Text style={styles.tech} key={tech}>
                      {tech}
                    </Text>                  
                  )
                })}                
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${project.id}`}
                >
                  {project.likes} curtida{project.likes > 1 && 's'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(project.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${project.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
