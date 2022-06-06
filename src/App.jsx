import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ProjectsProvider } from './context/ProjectsProvider'
import AuthLayout from './layouts/AuthLayout'
import ProtectedPath from './layouts/ProtectedPath'
import Project from './components/Project'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import NewPassword from './pages/NewPassword'
import ConfirmAccount from './pages/ConfirmAccount'
import Projects from './pages/Projects'
import NewProyect from './pages/NewProyect'
import EditProject from './pages/EditProject'
import NewCollaborator from './pages/NewCollaborator'

function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <ProjectsProvider>
                    <Routes>
                        <Route path='/' element={<AuthLayout />}>
                            <Route index element={<Login />} />
                            <Route path='register' element={<Register />} />
                            <Route path='reset-password' element={<ResetPassword />} />
                            <Route path='reset-password/:token' element={<NewPassword />} />
                            <Route path='confirm/:id' element={<ConfirmAccount />} />
                        </Route>

                        <Route path='/projects' element={ <ProtectedPath /> }>
                            <Route index element={<Projects />} />
                            <Route path='create-proyect' element={<NewProyect />} />
                            <Route path='new-collaborator/:id' element={<NewCollaborator />} />
                            <Route path=':id' element={<Project />} />
                            <Route path='edit/:id' element={<EditProject />} />
                        </Route>
                    </Routes>
                </ProjectsProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
