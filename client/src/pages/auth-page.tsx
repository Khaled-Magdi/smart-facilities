import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Lock, User, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { t, dir, language } = useLanguage();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", nameAr: "", nameEn: "" },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterFormData) => {
    registerMutation.mutate({
      ...data,
      role: "user",
    });
  };

  const translations = {
    login: { ar: "تسجيل الدخول", en: "Login" },
    register: { ar: "إنشاء حساب", en: "Register" },
    username: { ar: "اسم المستخدم", en: "Username" },
    password: { ar: "كلمة المرور", en: "Password" },
    nameAr: { ar: "الاسم بالعربية", en: "Arabic Name" },
    nameEn: { ar: "الاسم بالإنجليزية", en: "English Name" },
    loginDescription: { ar: "أدخل بيانات الدخول للوصول إلى النظام", en: "Enter your credentials to access the system" },
    registerDescription: { ar: "إنشاء حساب جديد للوصول إلى النظام", en: "Create a new account to access the system" },
    welcomeTitle: { ar: "نظام إدارة المنشآت الذكية", en: "Smart Facilities Management" },
    welcomeDescription: { ar: "نظام متكامل لإدارة المنشآت من الإنشاء حتى الصيانة", en: "Complete facility lifecycle management from creation to maintenance" },
    feature1: { ar: "إدارة شاملة للمنشآت", en: "Comprehensive facility management" },
    feature2: { ar: "تتبع مراحل التنفيذ", en: "Execution phase tracking" },
    feature3: { ar: "إدارة الزيارات والمشتريات", en: "Visit and procurement management" },
    feature4: { ar: "جدولة وتتبع الصيانة", en: "Maintenance scheduling and tracking" },
  };

  const getText = (key: keyof typeof translations) => translations[key][language];

  return (
    <div className="min-h-screen flex" dir={dir}>
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">{t("appName")}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">{getText("login")}</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">{getText("register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mt-4">
                    <CardDescription className="text-center">{getText("loginDescription")}</CardDescription>
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("username")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                data-testid="input-login-username"
                                className="ps-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("password")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="password"
                                data-testid="input-login-password"
                                className="ps-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      data-testid="button-login"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                      {getText("login")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 mt-4">
                    <CardDescription className="text-center">{getText("registerDescription")}</CardDescription>
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("username")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-register-username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("password")}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" data-testid="input-register-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("nameAr")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-register-nameAr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="nameEn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("nameEn")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-register-nameEn" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      data-testid="button-register"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                      {getText("register")}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground p-12 flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-12 w-12" />
            <h1 className="text-3xl font-bold">{getText("welcomeTitle")}</h1>
          </div>
          <p className="text-lg opacity-90">{getText("welcomeDescription")}</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              {getText("feature1")}
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              {getText("feature2")}
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              {getText("feature3")}
            </li>
            <li className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              {getText("feature4")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
