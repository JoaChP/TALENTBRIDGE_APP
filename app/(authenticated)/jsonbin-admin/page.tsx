"use client""use client""use client""use client""use client"



import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

import { Button } from "../../../components/ui/button"import { useState, useEffect } from "react"

import { Badge } from "../../../components/ui/badge"

import { Input } from "../../../components/ui/input"import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

import { Label } from "../../../components/ui/label"

import { Textarea } from "../../../components/ui/textarea"import { Button } from "../../../components/ui/button"import { useState, useEffect } from "react"

import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"

import { toast } from "sonner"import { Badge } from "../../../components/ui/badge"

import { RefreshCw, Download, Database, Server, Cloud } from "lucide-react"

import { Input } from "../../../components/ui/input"import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

export default function CloudStoragePage() {

  const [isLoading, setIsLoading] = useState(false)import { Label } from "../../../components/ui/label"

  const [remoteData, setRemoteData] = useState<any>(null)

  const [binId, setBinId] = useState("")import { Textarea } from "../../../components/ui/textarea"import { Button } from "../../../components/ui/button"import { useState, useEffect } from "react"import { useState, useEffect } from "react"

  const [enabled, setEnabled] = useState(false)

  const [connected, setConnected] = useState(false)import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"



  const loadConfig = () => {import { toast } from "sonner"import { Badge } from "../../../components/ui/badge"

    setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")

    setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')import { RefreshCw, Download, Database, Server, Cloud } from "lucide-react"

  }

import { Input } from "../../../components/ui/input"import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

  const loadRemoteData = async () => {

    setIsLoading(true)export default function JSONBinAdminPage() {

    try {

      const data = await vercelJsonBinService.fetchInitialData()  const [isLoading, setIsLoading] = useState(false)import { Label } from "../../../components/ui/label"

      setRemoteData(data)

      setConnected(!!data)  const [remoteData, setRemoteData] = useState<any>(null)

      if (data) {

        toast.success("Cloud data loaded successfully")  const [binId, setBinId] = useState("")import { Switch } from "../../../components/ui/switch"import { Button } from "../../../components/ui/button"import { Button } from "../../../components/ui/button"

      } else {

        toast.info("No cloud data available")  const [enabled, setEnabled] = useState(false)

      }

    } catch (error: any) {  const [connected, setConnected] = useState(false)import { Textarea } from "../../../components/ui/textarea"

      toast.error(`Error loading remote data: ${error.message}`)

      setRemoteData(null)

      setConnected(false)

    } finally {  const loadConfig = () => {import { hybridApi } from "../../../src/mocks/hybrid-api"import { Badge } from "../../../components/ui/badge"import { Badge } from "../../../components/ui/badge"

      setIsLoading(false)

    }    setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")

  }

    setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"

  const testConnection = async () => {

    setIsLoading(true)  }

    try {

      const data = await vercelJsonBinService.fetchInitialData()import { toast } from "sonner"import { Input } from "../../../components/ui/input"import { Input } from "../../../components/ui/input"

      setConnected(!!data)

      if (data) {  const loadRemoteData = async () => {

        toast.success("Connection successful!")

      } else {    setIsLoading(true)import { RefreshCw, Upload, Download, Database, Server, Cloud } from "lucide-react"

        toast.warning("Connected but no data found")

      }    try {

    } catch (error: any) {

      toast.error(`Connection failed: ${error.message}`)      const data = await vercelJsonBinService.fetchInitialData()import { Label } from "../../../components/ui/label"import { Label } from "../../../components/ui/label"

      setConnected(false)

    } finally {      setRemoteData(data)

      setIsLoading(false)

    }      setConnected(!!data)interface ServiceStatus {

  }

      if (data) {

  useEffect(() => {

    loadConfig()        toast.success("Cloud data loaded successfully")  jsonBinEnabled: booleanimport { Switch } from "../../../components/ui/switch"import { Switch } from "../../../components/ui/switch"

    if (process.env.NEXT_PUBLIC_USE_JSONBIN === 'true') {

      loadRemoteData()      } else {

    }

  }, [])        toast.info("No cloud data available")  connected: boolean



  const getDataSummary = (data: any) => {      }

    if (!data) return "No data"

    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`    } catch (error: any) {  lastSync: Date | nullimport { Textarea } from "../../../components/ui/textarea"import { Textarea } from "../../../components/ui/textarea"

  }

      toast.error(`Error loading remote data: ${error.message}`)

  return (

    <div className="space-y-6 p-6">      setRemoteData(null)  cacheValid: boolean

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-bold">Cloud Storage</h1>      setConnected(false)

        <Button onClick={loadRemoteData} variant="outline" size="sm" disabled={isLoading}>

          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />    } finally {}import { hybridApi } from "../../../src/mocks/hybrid-api"import { hybridApi } from "../../../src/mocks/hybrid-api"

          Refresh

        </Button>      setIsLoading(false)

      </div>

    }

      {/* Status Overview */}

      <div className="grid gap-4 md:grid-cols-3">  }

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">export default function JSONBinAdminPage() {import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"import { vercelJsonBinService } from "../../../src/services/vercel-jsonbin"

            <CardTitle className="text-sm font-medium">Status</CardTitle>

            <Cloud className="h-4 w-4 text-muted-foreground" />  const testConnection = async () => {

          </CardHeader>

          <CardContent>    setIsLoading(true)  const [status, setStatus] = useState<ServiceStatus | null>(null)

            <div className="text-2xl font-bold">

              <Badge variant={enabled ? "default" : "secondary"}>    try {

                {enabled ? "Enabled" : "Disabled"}

              </Badge>      const data = await vercelJsonBinService.fetchInitialData()  const [isLoading, setIsLoading] = useState(false)import { toast } from "sonner"import { toast } from "sonner"

            </div>

            <p className="text-xs text-muted-foreground">      setConnected(!!data)

              {enabled ? "JSONBin cloud storage active" : "Using local storage only"}

            </p>      if (data) {  const [remoteData, setRemoteData] = useState<any>(null)

          </CardContent>

        </Card>        toast.success("Connection successful!")



        <Card>      } else {  const [binId, setBinId] = useState("")import { RefreshCw, Upload, Download, Database, Server, Cloud } from "lucide-react"import { RefreshCw, Upload, Download, Database, Server, HardDrive } from "lucide-react"

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Connection</CardTitle>        toast.warning("Connected but no data found")

            <Server className="h-4 w-4 text-muted-foreground" />

          </CardHeader>      }  const [enabled, setEnabled] = useState(false)

          <CardContent>

            <div className="text-2xl font-bold">    } catch (error: any) {

              <Badge variant={connected ? "default" : "secondary"}>

                {connected ? "Online" : "Offline"}      toast.error(`Connection failed: ${error.message}`)

              </Badge>

            </div>      setConnected(false)

            <p className="text-xs text-muted-foreground">

              {connected ? "Connected to JSONBin" : "No connection"}    } finally {  const loadStatus = async () => {

            </p>

          </CardContent>      setIsLoading(false)

        </Card>

    }    try {interface ServiceStatus {interface ServiceStatus {

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">  }

            <CardTitle className="text-sm font-medium">Data</CardTitle>

            <Database className="h-4 w-4 text-muted-foreground" />      const serviceStatus = await hybridApi.getServiceStatus()

          </CardHeader>

          <CardContent>  useEffect(() => {

            <div className="text-2xl font-bold text-sm">

              {getDataSummary(remoteData)}    loadConfig()      setStatus(serviceStatus)  jsonBinEnabled: boolean  jsonBinEnabled: boolean

            </div>

            <p className="text-xs text-muted-foreground">    if (process.env.NEXT_PUBLIC_USE_JSONBIN === 'true') {

              Records in cloud storage

            </p>      loadRemoteData()      

          </CardContent>

        </Card>    }

      </div>

  }, [])      setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")  connected: boolean  connected: boolean

      {/* Configuration */}

      <Card>

        <CardHeader>

          <CardTitle>Configuration</CardTitle>  const getDataSummary = (data: any) => {      setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')

        </CardHeader>

        <CardContent className="space-y-4">    if (!data) return "No data"

          <div>

            <Label htmlFor="bin-id">JSONBin ID</Label>    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`        lastSync: Date | null  lastSync: Date | null

            <Input

              id="bin-id"  }

              value={binId || "Not configured"}

              readOnly    } catch (error: any) {

              className="bg-gray-50"

            />  return (

            <p className="text-xs text-muted-foreground mt-1">

              Set via NEXT_PUBLIC_JSONBIN_BIN_ID environment variable    <div className="space-y-6 p-6">      toast.error(`Error loading status: ${error.message}`)  cacheValid: boolean  cacheValid: boolean

            </p>

          </div>      <div className="flex items-center justify-between">

          

          <div>        <h1 className="text-3xl font-bold">Cloud Storage</h1>    }

            <Label>JSONBin Enabled</Label>

            <div className="mt-1">        <Button onClick={loadRemoteData} variant="outline" size="sm" disabled={isLoading}>

              <Badge variant={enabled ? "default" : "secondary"}>

                {enabled ? "TRUE" : "FALSE"}          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />  }}}

              </Badge>

            </div>          Refresh

            <p className="text-xs text-muted-foreground mt-1">

              Set via NEXT_PUBLIC_USE_JSONBIN environment variable        </Button>

            </p>

          </div>      </div>

          

          <div className="flex gap-2">  const loadRemoteData = async () => {

            <Button onClick={testConnection} disabled={isLoading || !binId}>

              {isLoading ? (      {/* Status Overview */}

                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />

              ) : (      <div className="grid gap-4 md:grid-cols-3">    setIsLoading(true)

                <Server className="h-4 w-4 mr-2" />

              )}        <Card>

              Test Connection

            </Button>          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">    try {export default function JSONBinAdminPage() {export default function JSONBinAdminPage() {

            <Button onClick={loadRemoteData} disabled={isLoading || !binId} variant="outline">

              <Download className="h-4 w-4 mr-2" />            <CardTitle className="text-sm font-medium">Status</CardTitle>

              Load Data

            </Button>            <Cloud className="h-4 w-4 text-muted-foreground" />      const data = await vercelJsonBinService.fetchInitialData()

          </div>

        </CardContent>          </CardHeader>

      </Card>

          <CardContent>      setRemoteData(data)  const [status, setStatus] = useState<ServiceStatus | null>(null)  const [status, setStatus] = useState<ServiceStatus | null>(null)

      {/* Cloud Data Preview */}

      <Card>            <div className="text-2xl font-bold">

        <CardHeader>

          <CardTitle className="flex items-center gap-2">              <Badge variant={enabled ? "default" : "secondary"}>      if (data) {

            <Cloud className="h-5 w-5" />

            Cloud Data Preview                {enabled ? "Enabled" : "Disabled"}

          </CardTitle>

        </CardHeader>              </Badge>        toast.success("Cloud data loaded")  const [isLoading, setIsLoading] = useState(false)  const [isLoading, setIsLoading] = useState(false)

        <CardContent>

          {remoteData ? (            </div>

            <div>

              <p className="text-sm mb-3 font-medium">{getDataSummary(remoteData)}</p>            <p className="text-xs text-muted-foreground">      } else {

              <Textarea

                value={JSON.stringify(remoteData, null, 2)}              {enabled ? "JSONBin cloud storage active" : "Using local storage only"}

                readOnly

                className="font-mono text-xs h-64 bg-gray-50"            </p>        toast.info("No cloud data available")  const [remoteData, setRemoteData] = useState<any>(null)  const [remoteData, setRemoteData] = useState<any>(null)

              />

            </div>          </CardContent>

          ) : (

            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center text-gray-500">        </Card>      }

              <div className="text-center">

                <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />

                <p className="font-medium">No cloud data available</p>

                <p className="text-xs mt-1">        <Card>    } catch (error: any) {  const [binId, setBinId] = useState("")  const [binId, setBinId] = useState("")

                  {!enabled ? "JSONBin is disabled" : !binId ? "No JSONBin ID configured" : "Click 'Load Data' to fetch from cloud"}

                </p>          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              </div>

            </div>            <CardTitle className="text-sm font-medium">Connection</CardTitle>      toast.error(`Error loading remote data: ${error.message}`)

          )}

        </CardContent>            <Server className="h-4 w-4 text-muted-foreground" />

      </Card>

    </div>          </CardHeader>      setRemoteData(null)  const [enabled, setEnabled] = useState(false)  const [enabled, setEnabled] = useState(false)

  )

}          <CardContent>

            <div className="text-2xl font-bold">    } finally {

              <Badge variant={connected ? "default" : "secondary"}>

                {connected ? "Online" : "Offline"}      setIsLoading(false)

              </Badge>

            </div>    }

            <p className="text-xs text-muted-foreground">

              {connected ? "Connected to JSONBin" : "No connection"}  }  const loadStatus = async () => {  const loadStatus = async () => {

            </p>

          </CardContent>

        </Card>

  const testConnection = async () => {    try {    try {

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">    setIsLoading(true)

            <CardTitle className="text-sm font-medium">Data</CardTitle>

            <Database className="h-4 w-4 text-muted-foreground" />    try {      const serviceStatus = await hybridApi.getServiceStatus()      const serviceStatus = await hybridApi.getServiceStatus()

          </CardHeader>

          <CardContent>      const data = await vercelJsonBinService.fetchInitialData()

            <div className="text-2xl font-bold text-sm">

              {getDataSummary(remoteData)}      if (data) {      setStatus(serviceStatus)      setStatus(serviceStatus)

            </div>

            <p className="text-xs text-muted-foreground">        toast.success("Connection successful!")

              Records in cloud storage

            </p>      } else {            

          </CardContent>

        </Card>        toast.warning("Connected but no data found")

      </div>

      }      // Load config from env      // Load config from env

      {/* Configuration */}

      <Card>      await loadStatus()

        <CardHeader>

          <CardTitle>Configuration</CardTitle>    } catch (error: any) {      setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")      setBinId(process.env.NEXT_PUBLIC_JSONBIN_BIN_ID || "")

        </CardHeader>

        <CardContent className="space-y-4">      toast.error(`Connection failed: ${error.message}`)

          <div>

            <Label htmlFor="bin-id">JSONBin ID</Label>    } finally {      setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')      setEnabled(process.env.NEXT_PUBLIC_USE_JSONBIN === 'true')

            <Input

              id="bin-id"      setIsLoading(false)

              value={binId || "Not configured"}

              readOnly    }            

              className="bg-gray-50"

            />  }

            <p className="text-xs text-muted-foreground mt-1">

              Set via NEXT_PUBLIC_JSONBIN_BIN_ID environment variable    } catch (error: any) {    } catch (error: any) {

            </p>

          </div>  useEffect(() => {

          

          <div>    loadStatus()      toast.error(`Error loading status: ${error.message}`)      toast.error(`Error loading status: ${error.message}`)

            <Label>JSONBin Enabled</Label>

            <div className="mt-1">    loadRemoteData()

              <Badge variant={enabled ? "default" : "secondary"}>

                {enabled ? "TRUE" : "FALSE"}  }, [])    }    }

              </Badge>

            </div>

            <p className="text-xs text-muted-foreground mt-1">

              Set via NEXT_PUBLIC_USE_JSONBIN environment variable  const getDataSummary = (data: any) => {  }  }

            </p>

          </div>    if (!data) return "No data"

          

          <div className="flex gap-2">    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`

            <Button onClick={testConnection} disabled={isLoading || !binId}>

              {isLoading ? (  }

                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />

              ) : (  const loadRemoteData = async () => {  const loadRemoteData = async () => {

                <Server className="h-4 w-4 mr-2" />

              )}  return (

              Test Connection

            </Button>    <div className="space-y-6 p-6">    setIsLoading(true)    setIsLoading(true)

            <Button onClick={loadRemoteData} disabled={isLoading || !binId} variant="outline">

              <Download className="h-4 w-4 mr-2" />      <div className="flex items-center justify-between">

              Load Data

            </Button>        <h1 className="text-3xl font-bold">Cloud Storage</h1>    try {    try {

          </div>

        </CardContent>        <div className="flex gap-2">

      </Card>

          <Button onClick={loadStatus} variant="outline" size="sm">      const data = await vercelJsonBinService.fetchInitialData()      const data = await vercelJsonBinService.fetchInitialData()

      {/* Cloud Data Preview */}

      <Card>            <RefreshCw className="h-4 w-4 mr-2" />

        <CardHeader>

          <CardTitle className="flex items-center gap-2">            Refresh      setRemoteData(data)      setRemoteData(data)

            <Cloud className="h-5 w-5" />

            Cloud Data Preview          </Button>

          </CardTitle>

        </CardHeader>        </div>      toast.success("Remote data loaded")      toast.success("Remote data loaded")

        <CardContent>

          {remoteData ? (      </div>

            <div>

              <p className="text-sm mb-3 font-medium">{getDataSummary(remoteData)}</p>    } catch (error: any) {    } catch (error: any) {

              <Textarea

                value={JSON.stringify(remoteData, null, 2)}      {/* Status Overview */}

                readOnly

                className="font-mono text-xs h-64 bg-gray-50"      <div className="grid gap-4 md:grid-cols-3">      toast.error(`Error loading remote data: ${error.message}`)      toast.error(`Error loading remote data: ${error.message}`)

              />

            </div>        <Card>

          ) : (

            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center text-gray-500">          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">      setRemoteData(null)      setRemoteData(null)

              <div className="text-center">

                <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />            <CardTitle className="text-sm font-medium">Storage Status</CardTitle>

                <p className="font-medium">No cloud data available</p>

                <p className="text-xs mt-1">            <Cloud className="h-4 w-4 text-muted-foreground" />    } finally {    } finally {

                  {!enabled ? "JSONBin is disabled" : !binId ? "No JSONBin ID configured" : "Click 'Load Data' to fetch from cloud"}

                </p>          </CardHeader>

              </div>

            </div>          <CardContent>      setIsLoading(false)      setIsLoading(false)

          )}

        </CardContent>            <div className="text-2xl font-bold">

      </Card>

    </div>              <Badge variant={status?.jsonBinEnabled ? "default" : "secondary"}>    }    }

  )

}                {status?.jsonBinEnabled ? "Active" : "Disabled"}

              </Badge>  }  }

            </div>

            <p className="text-xs text-muted-foreground">

              {status?.connected ? "Connected to JSONBin" : "Using local storage"}

            </p>  const migrate = async () => {  const migrate = async () => {

          </CardContent>

        </Card>    setIsLoading(true)    setIsLoading(true)



        <Card>    try {    try {

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Connection</CardTitle>      const success = await hybridApi.migrateToJSONBin()      const success = await hybridApi.migrateToJSONBin()

            <Server className="h-4 w-4 text-muted-foreground" />

          </CardHeader>      if (success) {      if (success) {

          <CardContent>

            <div className="text-2xl font-bold">        toast.success("Migration completed successfully")        toast.success("Migration completed successfully")

              <Badge variant={status?.connected ? "default" : "secondary"}>

                {status?.connected ? "Online" : "Offline"}        await loadStatus()        await loadStatus()

              </Badge>

            </div>        await loadRemoteData()        await loadRemoteData()

            <p className="text-xs text-muted-foreground">

              Last sync: {status?.lastSync ? status.lastSync.toLocaleString() : "Never"}      } else {      } else {

            </p>

          </CardContent>        toast.error("Migration failed")        toast.error("Migration failed")

        </Card>

      }      }

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">    } catch (error: any) {    } catch (error: any) {

            <CardTitle className="text-sm font-medium">Data Cache</CardTitle>

            <Database className="h-4 w-4 text-muted-foreground" />      toast.error(`Migration error: ${error.message}`)      toast.error(`Migration error: ${error.message}`)

          </CardHeader>

          <CardContent>    } finally {    } finally {

            <div className="text-2xl font-bold">

              <Badge variant={status?.cacheValid ? "default" : "secondary"}>      setIsLoading(false)      setIsLoading(false)

                {status?.cacheValid ? "Valid" : "Expired"}

              </Badge>    }    }

            </div>

            <p className="text-xs text-muted-foreground">  }  }

              {getDataSummary(remoteData)}

            </p>

          </CardContent>

        </Card>  const forceSync = async () => {  const forceSync = async () => {

      </div>

    setIsLoading(true)    setIsLoading(true)

      {/* Configuration */}

      <Card>    try {    try {

        <CardHeader>

          <CardTitle>Configuration</CardTitle>      const success = await hybridApi.forceSync()      const success = await hybridApi.forceSync()

        </CardHeader>

        <CardContent className="space-y-4">      if (success) {      if (success) {

          <div>

            <Label htmlFor="bin-id">JSONBin ID</Label>        toast.success("Sync completed")        toast.success("Sync completed")

            <Input

              id="bin-id"        await loadStatus()        await loadStatus()

              value={binId}

              placeholder="No JSONBin ID configured"        await loadRemoteData()        await loadRemoteData()

              readOnly

              className="bg-gray-50"      } else {      } else {

            />

            <p className="text-xs text-muted-foreground mt-1">        toast.error("Sync failed")        toast.error("Sync failed")

              Configured via NEXT_PUBLIC_JSONBIN_BIN_ID environment variable

            </p>      }      }

          </div>

              } catch (error: any) {    } catch (error: any) {

          <div className="flex gap-2">

            <Button onClick={testConnection} disabled={isLoading || !binId}>      toast.error(`Sync error: ${error.message}`)      toast.error(`Sync error: ${error.message}`)

              {isLoading ? (

                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />    } finally {    } finally {

              ) : (

                <Server className="h-4 w-4 mr-2" />      setIsLoading(false)      setIsLoading(false)

              )}

              Test Connection    }    }

            </Button>

            <Button onClick={loadRemoteData} disabled={isLoading || !binId} variant="outline">  }  }

              {isLoading ? (

                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />

              ) : (

                <Download className="h-4 w-4 mr-2" />  const testConnection = async () => {  const testConnection = async () => {

              )}

              Load Data    setIsLoading(true)    setIsLoading(true)

            </Button>

          </div>    try {    try {

        </CardContent>

      </Card>      await vercelJsonBinService.fetchInitialData()      await vercelJsonBinService.fetchInitialData()



      {/* Cloud Data Preview */}      toast.success("Connection successful!")      toast.success("Connection successful!")

      <Card>

        <CardHeader>      await loadStatus()      await loadStatus()

          <CardTitle className="flex items-center gap-2">

            <Cloud className="h-5 w-5" />    } catch (error: any) {    } catch (error: any) {

            Cloud Data Preview

          </CardTitle>      toast.error(`Connection failed: ${error.message}`)      toast.error(`Connection failed: ${error.message}`)

        </CardHeader>

        <CardContent>    } finally {    } finally {

          <p className="text-sm mb-2 font-medium">{getDataSummary(remoteData)}</p>

          {remoteData ? (      setIsLoading(false)      setIsLoading(false)

            <Textarea

              value={JSON.stringify(remoteData, null, 2)}    }    }

              readOnly

              className="font-mono text-xs h-64 bg-gray-50"  }  }

            />

          ) : (

            <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center text-gray-500">

              <div className="text-center">  const toggleJSONBin = () => {  const toggleJSONBin = () => {

                <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />

                <p>No cloud data available</p>    hybridApi.setJSONBinEnabled(!enabled)    hybridApi.setJSONBinEnabled(!enabled)

                <p className="text-xs">Configure JSONBin to enable cloud storage</p>

              </div>    setEnabled(!enabled)    setEnabled(!enabled)

            </div>

          )}    toast.success(`JSONBin ${!enabled ? 'enabled' : 'disabled'}`)    toast.success(`JSONBin ${!enabled ? 'enabled' : 'disabled'}`)

        </CardContent>

      </Card>  }  }

    </div>

  )

}
  useEffect(() => {  useEffect(() => {

    loadStatus()    loadStatus()

  }, [])    loadLocalData()

  }, [])

  const getDataSummary = (data: any) => {

    if (!data) return "No data"  const getDataSummary = (data: any) => {

    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`    if (!data) return "No data"

  }    return `${data.users?.length || 0} users, ${data.practices?.length || 0} practices, ${data.applications?.length || 0} applications`

  }

  return (

    <div className="space-y-6 p-6">  return (

      <div className="flex items-center justify-between">    <div className="space-y-6 p-6">

        <h1 className="text-3xl font-bold">JSONBin Cloud Storage</h1>      <div className="flex items-center justify-between">

        <div className="flex gap-2">        <h1 className="text-3xl font-bold">JSONBin Administration</h1>

          <Button onClick={loadStatus} variant="outline" size="sm">        <div className="flex gap-2">

            <RefreshCw className="h-4 w-4 mr-2" />          <Button onClick={loadStatus} variant="outline" size="sm">

            Refresh            <RefreshCw className="h-4 w-4 mr-2" />

          </Button>            Refresh

        </div>          </Button>

      </div>        </div>

      </div>

      {/* Status Overview */}

      <div className="grid gap-4 md:grid-cols-3">      {/* Status Overview */}

        <Card>      <div className="grid gap-4 md:grid-cols-3">

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">        <Card>

            <CardTitle className="text-sm font-medium">Cloud Storage</CardTitle>          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <Cloud className="h-4 w-4 text-muted-foreground" />            <CardTitle className="text-sm font-medium">JSONBin Status</CardTitle>

          </CardHeader>            <Database className="h-4 w-4 text-muted-foreground" />

          <CardContent>          </CardHeader>

            <div className="text-2xl font-bold">          <CardContent>

              <Badge variant={status?.jsonBinEnabled ? "default" : "secondary"}>            <div className="text-2xl font-bold">

                {status?.jsonBinEnabled ? "Active" : "Disabled"}              <Badge variant={status?.jsonBinEnabled ? "default" : "secondary"}>

              </Badge>                {status?.jsonBinEnabled ? "Enabled" : "Disabled"}

            </div>              </Badge>

            <p className="text-xs text-muted-foreground">            </div>

              {status?.connected ? "Connected to JSONBin" : "Using local storage"}            <p className="text-xs text-muted-foreground">

            </p>              {status?.connected ? "Connected" : "Not connected"}

          </CardContent>            </p>

        </Card>          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">        <Card>

            <CardTitle className="text-sm font-medium">Connection</CardTitle>          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <Server className="h-4 w-4 text-muted-foreground" />            <CardTitle className="text-sm font-medium">Connection</CardTitle>

          </CardHeader>            <Server className="h-4 w-4 text-muted-foreground" />

          <CardContent>          </CardHeader>

            <div className="text-2xl font-bold">          <CardContent>

              <Badge variant={status?.connected ? "default" : "secondary"}>            <div className="text-2xl font-bold">

                {status?.connected ? "Online" : "Offline"}              <Badge variant={status?.connected ? "default" : "destructive"}>

              </Badge>                {status?.connected ? "Online" : "Offline"}

            </div>              </Badge>

            <p className="text-xs text-muted-foreground">            </div>

              Last sync: {status?.lastSync ? status.lastSync.toLocaleString() : "Never"}            <p className="text-xs text-muted-foreground">

            </p>              Last sync: {status?.lastSync ? status.lastSync.toLocaleString() : "Never"}

          </CardContent>            </p>

        </Card>          </CardContent>

        </Card>

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">        <Card>

            <CardTitle className="text-sm font-medium">Data Cache</CardTitle>          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <Database className="h-4 w-4 text-muted-foreground" />            <CardTitle className="text-sm font-medium">Local Cache</CardTitle>

          </CardHeader>            <HardDrive className="h-4 w-4 text-muted-foreground" />

          <CardContent>          </CardHeader>

            <div className="text-2xl font-bold">          <CardContent>

              <Badge variant={status?.cacheValid ? "default" : "secondary"}>            <div className="text-2xl font-bold">

                {status?.cacheValid ? "Valid" : "Expired"}              <Badge variant={status?.cacheValid ? "default" : "secondary"}>

              </Badge>                {status?.cacheValid ? "Valid" : "Expired"}

            </div>              </Badge>

            <p className="text-xs text-muted-foreground">            </div>

              {getDataSummary(remoteData)}            <p className="text-xs text-muted-foreground">

            </p>              {getDataSummary(localData)}

          </CardContent>            </p>

        </Card>          </CardContent>

      </div>        </Card>

      </div>

      {/* Configuration */}

      <Card>      {/* Configuration */}

        <CardHeader>      <Card>

          <CardTitle>Configuration</CardTitle>        <CardHeader>

        </CardHeader>          <CardTitle>Configuration</CardTitle>

        <CardContent className="space-y-4">        </CardHeader>

          <div className="flex items-center space-x-2">        <CardContent className="space-y-4">

            <Switch          <div className="flex items-center space-x-2">

              id="jsonbin-enabled"            <Switch

              checked={enabled}              id="jsonbin-enabled"

              onCheckedChange={toggleJSONBin}              checked={enabled}

            />              onCheckedChange={toggleJSONBin}

            <Label htmlFor="jsonbin-enabled">Enable Cloud Storage</Label>            />

          </div>            <Label htmlFor="jsonbin-enabled">Enable JSONBin</Label>

                    </div>

          <div>          

            <Label htmlFor="bin-id">JSONBin ID</Label>          <div className="grid gap-4 md:grid-cols-2">

            <Input            <div>

              id="bin-id"              <Label htmlFor="bin-id">Bin ID</Label>

              value={binId}              <Input

              onChange={(e) => setBinId(e.target.value)}                id="bin-id"

              placeholder="Enter your JSONBin ID"                value={binId}

              readOnly                onChange={(e) => setBinId(e.target.value)}

            />                placeholder="Enter your JSONBin Bin ID"

            <p className="text-xs text-muted-foreground mt-1">              />

              Configured via environment variables            </div>

            </p>            <div>

          </div>              <Label htmlFor="secret-key">Secret Key</Label>

                        <Input

          <div className="flex gap-2">                id="secret-key"

            <Button onClick={testConnection} disabled={isLoading}>                type="password"

              Test Connection                value={secretKey}

            </Button>                onChange={(e) => setSecretKey(e.target.value)}

          </div>                placeholder="Enter your JSONBin Secret Key"

        </CardContent>              />

      </Card>            </div>

          </div>

      {/* Actions */}          

      <Card>          <div className="flex gap-2">

        <CardHeader>            <Button onClick={testConnection} disabled={isLoading}>

          <CardTitle>Data Management</CardTitle>              Test Connection

        </CardHeader>            </Button>

        <CardContent>          </div>

          <div className="grid gap-4 md:grid-cols-2">        </CardContent>

            <div className="space-y-2">      </Card>

              <Button 

                onClick={migrate}       {/* Actions */}

                disabled={isLoading || !status?.jsonBinEnabled}      <Card>

                className="w-full"        <CardHeader>

              >          <CardTitle>Data Management</CardTitle>

                <Upload className="h-4 w-4 mr-2" />        </CardHeader>

                Upload to Cloud        <CardContent>

              </Button>          <div className="grid gap-4 md:grid-cols-2">

              <p className="text-sm text-muted-foreground">            <div className="space-y-2">

                Backup current data to JSONBin cloud storage              <Button 

              </p>                onClick={migrate} 

            </div>                disabled={isLoading || !status?.jsonBinEnabled}

                            className="w-full"

            <div className="space-y-2">              >

              <Button                 <Upload className="h-4 w-4 mr-2" />

                onClick={forceSync}                 Migrate to JSONBin

                disabled={isLoading || !status?.jsonBinEnabled}              </Button>

                className="w-full"              <p className="text-sm text-muted-foreground">

              >                Upload current localStorage data to JSONBin

                <RefreshCw className="h-4 w-4 mr-2" />              </p>

                Sync Data            </div>

              </Button>            

              <p className="text-sm text-muted-foreground">            <div className="space-y-2">

                Synchronize with cloud storage              <Button 

              </p>                onClick={forceSync} 

            </div>                disabled={isLoading || !status?.jsonBinEnabled}

          </div>                className="w-full"

        </CardContent>              >

      </Card>                <RefreshCw className="h-4 w-4 mr-2" />

                Force Sync

      {/* Cloud Data Preview */}              </Button>

      <Card>              <p className="text-sm text-muted-foreground">

        <CardHeader>                Synchronize localStorage and JSONBin data

          <CardTitle className="flex items-center gap-2">              </p>

            <Cloud className="h-5 w-5" />            </div>

            Cloud Data (JSONBin)          </div>

            <Button onClick={loadRemoteData} variant="ghost" size="sm" disabled={isLoading}>        </CardContent>

              <Download className="h-4 w-4" />      </Card>

            </Button>

          </CardTitle>      {/* Data Preview */}

        </CardHeader>      <div className="grid gap-4 md:grid-cols-2">

        <CardContent>        <Card>

          <p className="text-sm mb-2">{getDataSummary(remoteData)}</p>          <CardHeader>

          <Textarea            <CardTitle className="flex items-center gap-2">

            value={remoteData ? JSON.stringify(remoteData, null, 2) : "No cloud data available"}              <HardDrive className="h-5 w-5" />

            readOnly              Local Data

            className="font-mono text-xs h-64"              <Button onClick={loadLocalData} variant="ghost" size="sm">

          />                <RefreshCw className="h-4 w-4" />

        </CardContent>              </Button>

      </Card>            </CardTitle>

    </div>          </CardHeader>

  )          <CardContent>

}            <p className="text-sm mb-2">{getDataSummary(localData)}</p>
            <Textarea
              value={localData ? JSON.stringify(localData, null, 2) : "No local data"}
              readOnly
              className="font-mono text-xs h-64"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Remote Data (JSONBin)
              <Button onClick={loadRemoteData} variant="ghost" size="sm" disabled={isLoading}>
                <Download className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{getDataSummary(remoteData)}</p>
            <Textarea
              value={remoteData ? JSON.stringify(remoteData, null, 2) : "No remote data"}
              readOnly
              className="font-mono text-xs h-64"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}