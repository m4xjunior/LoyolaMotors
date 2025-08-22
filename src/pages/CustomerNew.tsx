import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder for toast notifications
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
};

// Placeholder for API call to create customer
const createCustomer = async (data: z.infer<typeof customerSchema>) => {
  console.log('Creating customer with data:', data);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const customerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^[0-9]{9,}$/, 'Teléfono inválido'),
  nif: z.string().regex(/^[0-9]{8}[A-Z]$/, 'NIF inválido'),
  address: z.object({
    street: z.string().min(1, 'Dirección requerida'),
    city: z.string().min(1, 'Ciudad requerida'),
    postalCode: z.string().regex(/^[0-9]{5}$/, 'Código postal inválido'),
    province: z.string().min(1, 'Provincia requerida')
  }),
  vehicle: z.object({
    make: z.string().min(1, 'Marca requerida'),
    model: z.string().min(1, 'Modelo requerido'),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    licensePlate: z.string().regex(/^[0-9]{4}[A-Z]{3}$/, 'Matrícula inválida'),
    vin: z.string().optional()
  })
});

export function CustomerNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      nif: '',
      address: {
        street: '',
        city: 'Valencia',
        postalCode: '',
        province: 'Valencia'
      },
      vehicle: {
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        vin: ''
      }
    }
  });

  const onSubmit = async (data: z.infer<typeof customerSchema>) => {
    try {
      await createCustomer(data);
      toast.success('Cliente criado exitosamente');
      navigate('/customers');
    } catch (error) {
      toast.error('Error al crear el cliente');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Clientes
        </Button>
        
        <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
        <p className="text-gray-500 mt-2">
          Complete la información del cliente y su vehículo
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            )}>
              1
            </div>
            <span className="ml-3 font-medium">Datos Personales</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            )}>
              2
            </div>
            <span className="ml-3 font-medium">Información del Vehículo</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"
            )}>
              3
            </div>
            <span className="ml-3 font-medium">Confirmación</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Data */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Ingrese los datos personales del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan Pérez García"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIF/NIE</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345678A"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="cliente@ejemplo.com"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="600123456"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Dirección</h3>
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calle y Número</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Calle Mayor, 123"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="46001"
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Valencia"
                              {...field}
                              className="focus:ring-2 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address.province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione provincia" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Valencia">Valencia</SelectItem>
                                <SelectItem value="Alicante">Alicante</SelectItem>
                                <SelectItem value="Castellón">Castellón</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" onClick={() => setStep(2)}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Vehicle Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Vehículo</CardTitle>
                <CardDescription>
                  Ingrese los datos del vehículo del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicle.make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione marca" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Toyota">Toyota</SelectItem>
                              <SelectItem value="Honda">Honda</SelectItem>
                              <SelectItem value="Ford">Ford</SelectItem>
                              <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                              <SelectItem value="BMW">BMW</SelectItem>
                              <SelectItem value="Mercedes">Mercedes</SelectItem>
                              <SelectItem value="Audi">Audi</SelectItem>
                              <SelectItem value="Seat">Seat</SelectItem>
                              <SelectItem value="Peugeot">Peugeot</SelectItem>
                              <SelectItem value="Renault">Renault</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle.model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Corolla"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle.year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2023"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle.licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matrícula</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234ABC"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicle.vin"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>VIN (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de identificación del vehículo"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmar Información</CardTitle>
                <CardDescription>
                  Revise la información antes de crear el cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-lg">Datos Personales</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <dt className="text-sm text-gray-500">Nombre</dt>
                        <dd className="font-medium">{form.watch('name')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">NIF</dt>
                        <dd className="font-medium">{form.watch('nif')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Email</dt>
                        <dd className="font-medium">{form.watch('email')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Teléfono</dt>
                        <dd className="font-medium">{form.watch('phone')}</dd>
                      </div>
                      <div className="md:col-span-2">
                        <dt className="text-sm text-gray-500">Dirección</dt>
                        <dd className="font-medium">
                          {form.watch('address.street')}, {form.watch('address.postalCode')} {form.watch('address.city')}, {form.watch('address.province')}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-lg">Información del Vehículo</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <dt className="text-sm text-gray-500">Marca</dt>
                        <dd className="font-medium">{form.watch('vehicle.make')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Modelo</dt>
                        <dd className="font-medium">{form.watch('vehicle.model')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Año</dt>
                        <dd className="font-medium">{form.watch('vehicle.year')}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Matrícula</dt>
                        <dd className="font-medium">{form.watch('vehicle.licensePlate')}</dd>
                      </div>
                      {form.watch('vehicle.vin') && (
                        <div className="md:col-span-2">
                          <dt className="text-sm text-gray-500">VIN</dt>
                          <dd className="font-medium">{form.watch('vehicle.vin')}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Crear Cliente
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}