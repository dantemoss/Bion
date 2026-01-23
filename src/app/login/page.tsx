import { LoginForm } from "@/components/login-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 px-4">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Ingresar</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm mode="login" />
        </TabsContent>

        <TabsContent value="register">
          <LoginForm mode="signup" />
        </TabsContent>
      </Tabs>
    </div>
  )
}