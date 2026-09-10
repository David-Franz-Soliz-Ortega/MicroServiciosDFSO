| Medida                              | REST (P3)        | GraphQL (P4)   | gRPC (P5)        | 
|-------------------------------------|------------------|----------------|------------------| 
| Bytes de la respuesta               |133 bytes         |1293 bytes      |84 bytes          | 
| Tiempo promedio observado (ms)      |1.4936127s        |0.055828s       |0.026648 s        | 
| Viajes de red del cliente           | 1                | 1              |  1               | 
| Formato que viaja                   | texto            | texto          | binario          | 
| ¿Se puede leer sin el contrato?     | sí               | sí             | no               | 
| ¿El navegador lo consume directo?   | sí               | sí             | no               | 
| Público al que sirve mejor          |Terceros y público|Desarrolladores |Desarrolladores   |
                                      |en general        |Frontend y movil|Backend y Sistemas|
